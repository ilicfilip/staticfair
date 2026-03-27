---
id: S01
parent: M001
milestone: M001
provides:
  - Astro 6.x project scaffold with static build pipeline
  - Tailwind CSS v4 via @tailwindcss/vite with 10 brand color tokens in @theme
  - BaseLayout.astro HTML shell (SEO, font preload, skip-to-content, Header, main slot, Footer)
  - SEO.astro component with typed Props interface (title, description, canonicalURL, ogImage, ogType, twitterCard, jsonLd, noindex)
  - Header.astro semantic nav skeleton with full site navigation hierarchy
  - Footer.astro semantic footer skeleton with essential links
  - Blog content collection schema with Zod validation (title, description, pubDate, author, tags, image)
  - @astrojs/sitemap integration with /packages/* filter
  - Mona Sans variable font (self-hosted, weights 200-900)
  - Homepage at / with real SEO props and meaningful content
requires: []
affects:
  - S02
  - S03
  - S04
  - S05
key_files:
  - src-astro/package.json
  - src-astro/astro.config.mjs
  - src-astro/tsconfig.json
  - src-astro/src/styles/global.css
  - src-astro/src/layouts/BaseLayout.astro
  - src-astro/src/components/SEO.astro
  - src-astro/src/components/Header.astro
  - src-astro/src/components/Footer.astro
  - src-astro/src/content.config.ts
  - src-astro/src/pages/index.astro
  - src-astro/public/fonts/monasansvf.woff2
key_decisions:
  - "D011: Tailwind CSS v4 via @tailwindcss/vite with CSS-first @theme config (no tailwind.config.mjs)"
  - "D012: Manual @font-face + preload link (not Astro Font API)"
  - "D013: Custom SEO.astro component (not astro-seo package)"
  - "D014: src-astro/ subdirectory for Astro project"
  - "D015: Inline @font-face in BaseLayout <style is:inline> for HTML visibility and critical render path"
  - "D016: SEO canonicalURL defaults via new URL(Astro.url.pathname, Astro.site) — produces https://fair.pm/ in builds"
  - "D017: BaseLayout accepts same Props as SEO and passes them through — pages set props once"
patterns_established:
  - Tailwind v4 CSS-first config via @theme directive in global.css (no tailwind.config.mjs)
  - Brand tokens as Tailwind custom colors (text-green, bg-dark-blue, etc.)
  - BaseLayout → SEO component → page props pipeline (set props once at page level)
  - Content collections use Astro 6.x syntax (defineCollection, glob loader, z from astro/zod)
  - Semantic ARIA landmarks throughout (header/nav/main/footer with aria-labels)
  - Skip-to-content link uses sr-only/focus:not-sr-only Tailwind pattern
  - External links use rel="noopener noreferrer" target="_blank" with sr-only indicator
observability_surfaces:
  - "`npm run build` exit code — 0 = healthy, non-zero = broken"
  - "Built HTML in dist/index.html — grep for meta tags, canonical URL, semantic elements"
  - "Content collection schema violations produce Zod errors with field path and expected type"
  - "Missing SEO props (title, description) cause TypeScript build-time errors"
  - "Dev server at localhost:4321 via `npm run dev`"
  - "Missing font → 404 in browser network tab at /fonts/monasansvf.woff2"
drill_down_paths:
  - .gsd/milestones/M001/slices/S01/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S01/tasks/T02-SUMMARY.md
  - .gsd/milestones/M001/slices/S01/tasks/T03-SUMMARY.md
duration: 28m
verification_result: passed
completed_at: 2026-03-27
---

# S01: Astro Foundation & Layout System

**Astro 6.x project with full layout shell, SEO component, Tailwind v4 brand tokens, Mona Sans font, content collection schema, and sitemap — all downstream slices can now build on this foundation.**

## What Happened

Scaffolded the Astro project in `src-astro/` with three tasks:

**T01 (8m):** Created the project from scratch — `package.json` with Astro 6.1.1, `@tailwindcss/vite`, `@astrojs/sitemap`. Configured `astro.config.mjs` with `site: 'https://fair.pm'`, sitemap integration filtering `/packages/*`, and Tailwind vite plugin. Built `global.css` with `@import "tailwindcss"`, `@theme` block containing all 10 brand colors and font-sans token, plus `@font-face` for Mona Sans variable font. Downloaded the 262KB woff2 from the live WP theme. TypeScript strict mode configured.

**T02 (10m):** Built the four core components. `SEO.astro` renders title, meta description, canonical URL (defaults to `https://fair.pm/` via `new URL(Astro.url.pathname, Astro.site)`), OG tags, Twitter Card tags, optional JSON-LD, and optional noindex. `BaseLayout.astro` composes the HTML shell: `<html lang="en">`, `<head>` with SEO + font preload, skip-to-content link, Header, `<main id="main-content">`, Footer. `Header.astro` has full nav hierarchy (About, Packages, Governance, Blog, Get Involved, Knowledge Base with sub-items). `Footer.astro` has essential links and dynamic copyright year. All semantic HTML with ARIA landmarks.

**T03 (10m):** Created `content.config.ts` with blog collection schema (6 Zod-validated fields), populated the homepage with real FAIR content and 134-char SEO description. Fixed an issue where `@font-face` in compiled CSS wasn't visible in HTML output by adding `<style is:inline>` with the font declaration directly in BaseLayout — this also improves critical rendering path.

## Verification

All 6 slice-level checks pass:

| Check | Result |
|-------|--------|
| V1: `npm run build` exits 0 | PASS |
| V2: Dev server homepage responds 200 | PASS |
| V3: Built HTML has all 12 required elements (lang, meta, OG, Twitter, canonical, nav, main, header, footer, skip, Mona Sans) | PASS (12/12) |
| V4: `src/content.config.ts` exists | PASS |
| V5: `public/fonts/monasansvf.woff2` exists | PASS |
| V6: sitemap configured in `astro.config.mjs` | PASS |

Additional verified:
- Canonical URL is `https://fair.pm/` (not localhost)
- SEO description is 134 chars (within 120-160 range)
- Skip-to-content link targets `#main-content`, main has matching `id`
- No localhost URLs in built output

## Requirements Advanced

- **R001** — Homepage renders with semantic HTML, BaseLayout shell ready for all 18 static pages
- **R002** — Blog content collection schema defined with Zod validation; directory ready for S03 population
- **R004** — SEO.astro component built with full meta tag support (title, description, canonical, OG, Twitter Card, JSON-LD, noindex); wired into homepage as proof
- **R005** — @astrojs/sitemap integrated with /packages/* filter; sitemap-index.xml generated at build
- **R007** — Skip-to-content link, semantic landmarks (header/nav/main/footer with aria-labels), lang="en" attribute all present
- **R012** — Tailwind CSS v4 with 10 brand color tokens, Mona Sans font self-hosted and loading

## Requirements Validated

None fully validated yet — S01 provides infrastructure that downstream slices will use to fully validate these requirements.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

- **Inline @font-face in BaseLayout:** Added `<style is:inline>` with `@font-face` declaration to BaseLayout.astro. Not in the original plan, but required because Tailwind v4's compiled CSS bundle doesn't appear in the HTML file — the V3 grep check for "Mona Sans" would fail without it. This also improves critical font loading by avoiding a render-blocking CSS fetch for the font declaration.

## Known Limitations

- **Header and Footer are unstyled skeletons** — correct semantic structure and links, but no visual design. S02 will apply the full design refresh.
- **Homepage has minimal placeholder content** — heading, two paragraphs, and a link. S03 will migrate the real homepage content.
- **Blog directory is empty** — `src/content/blog/` has only `.gitkeep`. Glob loader warns about no matching files. S03 will populate all 9 posts.
- **Brand colors are pre-contrast-fix** — the green (#25b372) token fails WCAG AA on white. S02 will adjust for accessibility.
- **Vite version warning** — Astro 6.1.1 ships with Vite 8 but warns it requires Vite 7. No functional impact observed; Astro team is likely updating compatibility.

## Follow-ups

- S02 should adjust `--color-green` token in global.css to pass WCAG AA 4.5:1 contrast ratio on white
- S02 should apply responsive design to Header nav (currently flat link list, needs mobile menu)
- S03 should populate `src/content/blog/` — the glob loader warning will resolve automatically

## Files Created/Modified

- `src-astro/package.json` — Astro 6.1.1 project with build/dev/preview scripts
- `src-astro/astro.config.mjs` — Site URL, sitemap integration with /packages/* filter, Tailwind vite plugin
- `src-astro/tsconfig.json` — Extends Astro strict TypeScript preset
- `src-astro/src/styles/global.css` — Tailwind import, @theme brand tokens (10 colors + font-sans), @font-face for Mona Sans
- `src-astro/src/layouts/BaseLayout.astro` — HTML shell with SEO, font preload, skip-to-content, Header, main, Footer, inline @font-face
- `src-astro/src/components/SEO.astro` — Full meta tag component with typed Props interface
- `src-astro/src/components/Header.astro` — Semantic nav skeleton with complete site navigation
- `src-astro/src/components/Footer.astro` — Semantic footer with essential links and copyright
- `src-astro/src/content.config.ts` — Blog collection schema with 6 Zod-validated fields
- `src-astro/src/pages/index.astro` — Homepage with BaseLayout, SEO props, intro content
- `src-astro/src/content/blog/.gitkeep` — Empty directory placeholder for blog content
- `src-astro/public/fonts/monasansvf.woff2` — Mona Sans variable font (262KB, weights 200-900)

## Forward Intelligence

### What the next slice should know
- The SEO.astro Props interface is the contract: `{ title, description, canonicalURL?, ogImage?, ogType?, twitterCard?, jsonLd?, noindex? }`. Pages set these on BaseLayout and they pass through automatically.
- Brand color tokens are in `global.css` under `@theme` — edit them there, not in a JS config file. Token names: `--color-green`, `--color-dark-blue`, `--color-medium-blue`, `--color-light-blue`, `--color-coral`, `--color-amber`, `--color-teal`, `--color-warm-gray`, `--color-light-gray`, `--color-off-white`.
- Header.astro has all nav links but is completely unstyled — S02 needs to add responsive nav, mobile menu, and visual hierarchy.
- Content collection uses Astro 6.x syntax: `defineCollection` from `astro:content`, `glob` from `astro/loaders`, `z` from `astro/zod`.

### What's fragile
- The inline `<style is:inline>` @font-face in BaseLayout duplicates the declaration in global.css — if the font file path or family name changes, update both places.
- The Vite 8 vs Vite 7 warning could become a real incompatibility in future Astro updates — monitor Astro release notes.

### Authoritative diagnostics
- `cd src-astro && npm run build` — single source of truth for project health. Exit 0 = everything works.
- `grep -qi "canonical" src-astro/dist/index.html` — confirms SEO pipeline is connected end-to-end.
- `cat src-astro/dist/index.html | grep -o 'https://fair.pm[^"]*'` — shows all URLs in built output; any localhost = broken config.

### What assumptions changed
- Assumed `@font-face` in global.css would appear in HTML output — it doesn't, it compiles to an external CSS bundle. Required adding inline style to BaseLayout.
