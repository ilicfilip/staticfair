---
estimated_steps: 6
estimated_files: 6
---

# T01: Scaffold Astro project with Tailwind v4 and core dependencies

**Slice:** S01 — Astro Foundation & Layout System
**Milestone:** M001

## Description

Create the Astro 6.x project from scratch with all core dependencies: Tailwind CSS v4 (via `@tailwindcss/vite`), `@astrojs/sitemap`, TypeScript strict mode. Configure `astro.config.mjs` with `site: 'https://fair.pm'`, static output, sitemap with `/packages/*` filter, and Tailwind vite plugin. Set up `global.css` with Tailwind import, `@theme` brand tokens (colors and typography from M001-CONTEXT.md), and Mona Sans `@font-face` declaration. Download the Mona Sans variable font file. Create a minimal homepage placeholder so the build succeeds.

## Steps

1. Create `src-astro/` directory and initialize with `npm create astro@latest` (empty template, TypeScript strict) — or manually scaffold `package.json`, `tsconfig.json`, and `astro.config.mjs` if the CLI adds unwanted boilerplate
2. Install dependencies: `astro`, `@tailwindcss/vite`, `tailwindcss`, `@astrojs/sitemap`
3. Configure `astro.config.mjs`: `site: 'https://fair.pm'`, `output: 'static'` (default), sitemap integration with `filter: (page) => !page.includes('/packages/')`, vite plugins array with `tailwindcss()`
4. Create `src-astro/src/styles/global.css` with `@import "tailwindcss"`, `@theme` block containing all brand color tokens (green, orange, red, blue, dark-blue, light-blue, black, white, light-gray, dark-gray) and typography tokens (font-sans with Mona Sans fallback stack), and `@font-face` for Mona Sans variable font (woff2, weight 200-900, display swap)
5. Download Mona Sans variable font file to `src-astro/public/fonts/monasansvf.woff2` from the WP theme URL or GitHub releases
6. Create minimal `src-astro/src/pages/index.astro` that imports global.css and renders a basic HTML page so `astro build` succeeds

## Must-Haves

- [ ] Astro 6.x installed (check `npx astro --version`)
- [ ] `astro.config.mjs` has `site: 'https://fair.pm'`
- [ ] `astro.config.mjs` has sitemap integration with `/packages/*` filter
- [ ] `astro.config.mjs` has `@tailwindcss/vite` in vite plugins
- [ ] `global.css` has `@import "tailwindcss"` and `@theme` with all 10 brand colors
- [ ] `global.css` has `@font-face` for Mona Sans with `font-weight: 200 900`
- [ ] `public/fonts/monasansvf.woff2` exists and is a valid font file (>100KB)
- [ ] `tsconfig.json` extends Astro's strict preset
- [ ] `astro build` exits 0

## Verification

- `cd src-astro && npm run build` exits 0
- `test -f public/fonts/monasansvf.woff2` passes
- `grep -q "fair.pm" astro.config.mjs` passes
- `grep -q "sitemap" astro.config.mjs` passes
- `grep -q "@tailwindcss/vite" astro.config.mjs` passes
- `grep -q "Mona Sans" src/styles/global.css` passes

## Observability Impact

- Signals added/changed: Astro build output reports success/failure with clear error messages; Tailwind compilation errors surface during build
- How a future agent inspects this: `npm run build` exit code; `ls dist/` to confirm output; dev server at localhost:4321
- Failure state exposed: Missing font file → 404 in dev network tab; wrong Tailwind config → build error with file path; missing site config → localhost canonical URLs in build output

## Inputs

- `.gsd/milestones/M001/M001-CONTEXT.md` — design tokens (colors, typography) to copy into `@theme` block
- `.gsd/milestones/M001/slices/S01/S01-RESEARCH.md` — Astro 6.x config patterns, Tailwind v4 CSS-first approach, font file URL

## Expected Output

- `src-astro/package.json` — Astro 6.x + dependencies installed
- `src-astro/astro.config.mjs` — fully configured with site, sitemap, tailwind
- `src-astro/tsconfig.json` — TypeScript strict
- `src-astro/src/styles/global.css` — Tailwind import + @theme tokens + @font-face
- `src-astro/public/fonts/monasansvf.woff2` — Mona Sans variable font file
- `src-astro/src/pages/index.astro` — minimal placeholder homepage
- `src-astro/dist/` — build output directory (proves build works)
