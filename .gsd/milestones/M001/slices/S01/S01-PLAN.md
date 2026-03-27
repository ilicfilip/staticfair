# S01: Astro Foundation & Layout System

**Goal:** Establish the Astro project scaffold with layout system, design tokens, and SEO component that all subsequent slices depend on.
**Demo:** `astro dev` serves a working homepage at localhost with BaseLayout, Header (skeleton), Footer (skeleton), SEO component, Tailwind CSS v4 with brand color tokens, Mona Sans variable font, and a content collection schema ready for blog posts. The page renders with correct HTML structure, semantic landmarks, `lang="en"`, skip-to-content link, and all meta tags populated.

## Must-Haves

- Astro 6.x project with `output: 'static'`, TypeScript strict, `site: 'https://fair.pm'`
- `BaseLayout.astro` with `<html lang="en">`, `<head>` (SEO slot, font preload), skip-to-content link, Header, `<main id="main-content">`, Footer
- `Header.astro` — semantic `<header>` with `<nav>`, correct navigation links matching nav structure, unstyled skeleton
- `Footer.astro` — semantic `<footer>`, unstyled skeleton
- `SEO.astro` — component accepting title, description, canonicalURL, ogImage, ogType, twitterCard, jsonLd, noindex props; renders all meta tags
- Tailwind CSS v4 via `@tailwindcss/vite` with brand color tokens in `@theme` directive
- `global.css` with Tailwind import, `@theme` tokens (colors + typography), `@font-face` for Mona Sans variable font (weights 200-900)
- `public/fonts/monasansvf.woff2` — self-hosted Mona Sans variable font file
- `src/content.config.ts` — blog content collection with Zod schema (title, description, pubDate, author, tags, image)
- `@astrojs/sitemap` integrated with `/packages/*` filter
- Homepage at `src/pages/index.astro` using BaseLayout with real SEO props
- All HTML output uses semantic elements and ARIA landmarks

## Proof Level

- This slice proves: contract (layout shell + SEO interface + design token infrastructure)
- Real runtime required: yes (`astro dev` and `astro build` must succeed)
- Human/UAT required: no

## Verification

```bash
# V1: Astro builds without errors
cd src-astro && npm run build

# V2: Dev server starts and homepage responds 200
cd src-astro && timeout 15 bash -c 'npm run dev &
  DEV_PID=$!
  sleep 8
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/)
  kill $DEV_PID 2>/dev/null
  [ "$STATUS" = "200" ] && echo "PASS: homepage 200" || (echo "FAIL: got $STATUS" && exit 1)'

# V3: Built HTML contains required elements (run after V1)
cd src-astro && bash -c '
  HTML=$(cat dist/index.html)
  PASS=true
  for CHECK in "lang=\"en\"" "<meta name=\"description\"" "og:title" "og:description" "twitter:card" "canonical" "<nav" "<main" "<header" "<footer" "skip" "Mona Sans"; do
    if echo "$HTML" | grep -qi "$CHECK"; then
      echo "PASS: found $CHECK"
    else
      echo "FAIL: missing $CHECK"
      PASS=false
    fi
  done
  $PASS || exit 1'

# V4: Content collection schema defined
cd src-astro && test -f src/content.config.ts && echo "PASS: content config exists" || (echo "FAIL" && exit 1)

# V5: Font file present
cd src-astro && test -f public/fonts/monasansvf.woff2 && echo "PASS: font file exists" || (echo "FAIL" && exit 1)

# V6: Sitemap integration configured (check astro.config.mjs)
cd src-astro && grep -q "sitemap" astro.config.mjs && echo "PASS: sitemap configured" || (echo "FAIL" && exit 1)
```

## Observability / Diagnostics

- Runtime signals: Astro dev server console output (build errors, HMR errors, content collection validation errors surface automatically)
- Inspection surfaces: `astro build` exit code + `dist/` output; `curl localhost:4321` for dev server; built HTML files in `dist/` for static analysis
- Failure visibility: Astro surfaces content collection schema violations as build errors with file path and field name. Tailwind config errors show in dev console. Missing font file causes 404 in browser network tab.
- Redaction constraints: none (no secrets in this slice)

## Integration Closure

- Upstream surfaces consumed: none (first slice)
- New wiring introduced in this slice: BaseLayout → SEO component → page props pipeline; Tailwind vite plugin → global.css → @theme tokens; content.config.ts schema (consumed by S03); sitemap integration with filter (consumed by S04/S05)
- What remains before the milestone is truly usable end-to-end: S02 (visual design + accessibility), S03 (content migration), S04 (structured data), S05 (deployment + redirects)

## Tasks

- [x] **T01: Scaffold Astro project with Tailwind v4 and core dependencies** `est:30m`
  - Why: Creates the project foundation — package.json, astro.config.mjs, TypeScript config, Tailwind v4 via vite plugin, sitemap integration. Everything else builds on this.
  - Files: `src-astro/package.json`, `src-astro/astro.config.mjs`, `src-astro/tsconfig.json`, `src-astro/src/styles/global.css`, `src-astro/src/pages/index.astro`
  - Do: Run `npm create astro@latest` (or manual scaffold). Install `@tailwindcss/vite`, `@astrojs/sitemap`. Configure astro.config.mjs with site URL, vite tailwind plugin, sitemap with /packages/ filter. Set up global.css with `@import "tailwindcss"` and `@theme` block containing all brand color + typography tokens from M001-CONTEXT.md. Create minimal index.astro as placeholder. Download Mona Sans font to `public/fonts/monasansvf.woff2`. Add `@font-face` declaration in global.css with weight range 200-900.
  - Verify: `npm run build` succeeds; `public/fonts/monasansvf.woff2` exists; `astro.config.mjs` has site and sitemap configured
  - Done when: `astro build` exits 0 and produces `dist/index.html`

- [x] **T02: Build BaseLayout, Header skeleton, Footer skeleton, and SEO component** `est:45m`
  - Why: Produces the layout shell and SEO contract that every subsequent slice consumes. This is the S01→S02, S01→S03, and S01→S04 boundary.
  - Files: `src-astro/src/layouts/BaseLayout.astro`, `src-astro/src/components/Header.astro`, `src-astro/src/components/Footer.astro`, `src-astro/src/components/SEO.astro`
  - Do: Build SEO.astro with full props interface (title, description, canonicalURL, ogImage, ogType, twitterCard, jsonLd, noindex). Render `<title>`, meta description, canonical, OG tags, Twitter Card tags, JSON-LD script tag. Build BaseLayout with `<html lang="en">`, `<head>` with SEO component + font preload link (with crossorigin), skip-to-content link, Header, `<main id="main-content">`, Footer, global.css import. Build Header.astro with `<header>` + `<nav aria-label="Main">` + full nav structure (About, Packages, Governance, Blog, Get Involved, Knowledge Base). Build Footer.astro with `<footer>`. All semantic HTML with ARIA landmarks.
  - Verify: `astro build` succeeds; built index.html contains `lang="en"`, `<nav`, `<main`, `<header`, `<footer`, `<meta name="description"`, `og:title`, `twitter:card`, `canonical`, `skip`
  - Done when: All 6 verification checks (V1-V6) pass

- [x] **T03: Define blog content collection schema and wire homepage** `est:20m`
  - Why: Defines the content collection contract that S03 depends on, and wires the homepage with real SEO props so the demo is complete and verifiable.
  - Files: `src-astro/src/content.config.ts`, `src-astro/src/pages/index.astro`
  - Do: Create content.config.ts with blog collection using glob loader pointing to `./src/content/blog`, Zod schema with title (string), description (string), pubDate (coerce date), author (string optional), tags (array string optional), image (string optional). Create `src/content/blog/` directory. Update index.astro to use BaseLayout with meaningful SEO props (title: "FAIR — Federated and Independent Repositories", description: placeholder 120-160 chars, ogType: "website"). Add minimal homepage content (heading, brief text) so the page isn't blank.
  - Verify: `astro build` succeeds; `src/content.config.ts` exists and imports from `astro:content` and `astro/zod`; homepage renders with proper meta tags
  - Done when: Full build succeeds, content config is valid, homepage serves at localhost:4321 with all meta tags and layout shell visible

## Files Likely Touched

- `src-astro/package.json`
- `src-astro/astro.config.mjs`
- `src-astro/tsconfig.json`
- `src-astro/src/styles/global.css`
- `src-astro/src/layouts/BaseLayout.astro`
- `src-astro/src/components/Header.astro`
- `src-astro/src/components/Footer.astro`
- `src-astro/src/components/SEO.astro`
- `src-astro/src/content.config.ts`
- `src-astro/src/pages/index.astro`
- `src-astro/public/fonts/monasansvf.woff2`
