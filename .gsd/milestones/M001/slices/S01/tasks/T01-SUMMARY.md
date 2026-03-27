---
id: T01
parent: S01
milestone: M001
provides:
  - Astro 6.x project scaffold with build pipeline
  - Tailwind CSS v4 via @tailwindcss/vite with brand color tokens
  - @astrojs/sitemap integration with /packages/* filter
  - Mona Sans variable font (self-hosted)
  - Global CSS with @theme design tokens and @font-face
key_files:
  - src-astro/package.json
  - src-astro/astro.config.mjs
  - src-astro/tsconfig.json
  - src-astro/src/styles/global.css
  - src-astro/src/pages/index.astro
  - src-astro/public/fonts/monasansvf.woff2
key_decisions: []
patterns_established:
  - Tailwind v4 CSS-first config via @theme directive in global.css (no tailwind.config.mjs)
  - Brand tokens as Tailwind custom colors (text-green, bg-dark-blue, etc.)
  - Font preload with crossorigin attribute in page head
observability_surfaces:
  - "`npm run build` exit code — 0 = healthy, non-zero = broken"
  - "`ls src-astro/dist/` — confirms build output exists"
  - "Dev server at localhost:4321 via `npm run dev`"
duration: 8m
verification_result: passed
completed_at: 2026-03-27
blocker_discovered: false
---

# T01: Scaffold Astro project with Tailwind v4 and core dependencies

**Scaffolded Astro 6.1.1 project with Tailwind CSS v4, sitemap integration, Mona Sans font, and all 10 brand color tokens configured — build exits 0.**

## What Happened

Manually scaffolded the `src-astro/` project (no CLI to avoid boilerplate). Installed astro@6.1.1, @tailwindcss/vite, tailwindcss, and @astrojs/sitemap. Configured `astro.config.mjs` with `site: 'https://fair.pm'`, sitemap with `/packages/` filter, and Tailwind vite plugin. Created `global.css` with `@import "tailwindcss"`, `@theme` block containing all 10 brand colors and font-sans typography token, plus `@font-face` declaration for Mona Sans (weight 200-900, display swap). Downloaded Mona Sans variable font (262KB woff2) from the live WP theme. Created minimal `index.astro` placeholder with font preload and basic content. TypeScript configured with Astro's strict preset.

## Verification

All 9 task must-haves passed:
- Astro 6.1.1 installed (v6.x ✓)
- `astro.config.mjs` has `site: 'https://fair.pm'` ✓
- `astro.config.mjs` has sitemap with `/packages/` filter ✓
- `astro.config.mjs` has `@tailwindcss/vite` in vite plugins ✓
- `global.css` has `@import "tailwindcss"` and `@theme` with all 10 brand colors ✓
- `global.css` has `@font-face` for Mona Sans with `font-weight: 200 900` ✓
- `public/fonts/monasansvf.woff2` exists and is 262KB (>100KB) ✓
- `tsconfig.json` extends `astro/tsconfigs/strict` ✓
- `astro build` exits 0 ✓

Slice-level checks (partial, as expected for T01):
- V1 (build): PASS
- V5 (font file): PASS
- V6 (sitemap config): PASS
- V3 (HTML elements): Partial — `lang="en"` and `<main` present; SEO meta, nav, header, footer, skip-link are T02 scope
- V4 (content config): Expected fail — T03 scope

## Diagnostics

- `cd src-astro && npm run build` — exits 0 if scaffold is healthy, shows specific file/line errors if broken
- `cd src-astro && npm run dev` — starts dev server at localhost:4321 for visual inspection
- Missing font → 404 in browser network tab at `/fonts/monasansvf.woff2`
- Tailwind config errors → build error with CSS file path in output

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `src-astro/package.json` — Astro 6.1.1 project with build/dev/preview scripts
- `src-astro/astro.config.mjs` — Site URL, sitemap integration, Tailwind vite plugin
- `src-astro/tsconfig.json` — Extends Astro strict TypeScript preset
- `src-astro/src/styles/global.css` — Tailwind import, @theme brand tokens (10 colors + font-sans), @font-face for Mona Sans
- `src-astro/src/pages/index.astro` — Minimal placeholder homepage with font preload
- `src-astro/public/fonts/monasansvf.woff2` — Mona Sans variable font (262KB, weights 200-900)
