---
estimated_steps: 5
estimated_files: 5
---

# T02: Build BaseLayout, Header skeleton, Footer skeleton, and SEO component

**Slice:** S01 — Astro Foundation & Layout System
**Milestone:** M001

## Description

Build the four core components that form the S01 boundary contract. `SEO.astro` is the meta-tag component consumed by every page across S02, S03, and S04 — its props interface is the SEO contract. `BaseLayout.astro` is the HTML shell wrapping every page: `<html lang="en">`, `<head>` with SEO component and font preload, skip-to-content link, Header, `<main id="main-content">`, Footer. `Header.astro` is an unstyled semantic nav skeleton with the full site navigation structure. `Footer.astro` is an unstyled semantic footer. All use proper semantic HTML and ARIA landmarks.

## Steps

1. Create `src-astro/src/components/SEO.astro` with Props interface: `title` (string), `description` (string), `canonicalURL` (URL, optional — defaults to `new URL(Astro.url.pathname, Astro.site)`), `ogImage` (string, optional), `ogType` (string, defaults to `'website'`), `twitterCard` (string, defaults to `'summary_large_image'`), `jsonLd` (Record<string,any>, optional), `noindex` (boolean, optional). Render: `<title>`, `<meta name="description">`, `<link rel="canonical">`, `<meta property="og:title">`, `<meta property="og:description">`, `<meta property="og:url">`, `<meta property="og:type">`, `<meta property="og:image">` (conditional), `<meta name="twitter:card">`, `<meta name="twitter:title">`, `<meta name="twitter:description">`, `<meta name="twitter:image">` (conditional), `<meta name="robots" content="noindex,nofollow">` (conditional on noindex), JSON-LD `<script type="application/ld+json">` (conditional on jsonLd).
2. Create `src-astro/src/components/Header.astro` with `<header>` containing `<nav aria-label="Main">`. Include the full nav structure from research: About (with sub-items: FAIR's Mandate, FAIR Initiatives, Roadmap), Packages (external link to /packages/ with sub-items: Plugins, Themes), Governance (with sub-items: Technical Steering Committee, Linux Foundation, Code of Conduct, Antitrust Policy, Privacy Policy, Terms of Use), Blog, Get Involved (with sub-items: Join Slack external, Join a Meeting external, FAIR Working Groups), Knowledge Base. Use `<ul>`/`<li>` list structure. Mark external links. No styling — structural HTML only.
3. Create `src-astro/src/components/Footer.astro` with `<footer>` containing basic copyright text and essential links (Privacy Policy, Terms of Use, Code of Conduct). Minimal semantic structure.
4. Create `src-astro/src/layouts/BaseLayout.astro` that accepts Props (passed through to SEO). Structure: `<html lang="en">` → `<head>` with charset, viewport, SEO component, font preload `<link rel="preload" href="/fonts/monasansvf.woff2" as="font" type="font/woff2" crossorigin>`, global.css import → `<body>` with skip-to-content link (`<a href="#main-content" class="sr-only focus:not-sr-only ...">Skip to main content</a>`), Header, `<main id="main-content">` with default `<slot />`, Footer.
5. Update `src-astro/src/pages/index.astro` to use BaseLayout with real SEO props (title, description) and verify the full pipeline renders correctly.

## Must-Haves

- [ ] SEO.astro renders title, meta description, canonical URL, OG tags (title, description, url, type), Twitter Card tags (card, title, description), and conditional JSON-LD script
- [ ] SEO.astro defaults canonicalURL to `new URL(Astro.url.pathname, Astro.site)` — produces `https://fair.pm/` not localhost
- [ ] SEO.astro conditionally renders noindex meta and conditional OG/Twitter image tags
- [ ] BaseLayout has `<html lang="en">`, font preload with `crossorigin`, skip-to-content link, semantic structure
- [ ] Header has `<header>` with `<nav aria-label="Main">` and correct nav links
- [ ] Footer has `<footer>` with semantic structure
- [ ] index.astro uses BaseLayout and passes SEO props

## Verification

- `cd src-astro && npm run build` exits 0
- Built `dist/index.html` contains: `lang="en"`, `<meta name="description"`, `og:title`, `og:description`, `og:url`, `twitter:card`, `rel="canonical"`, `<nav`, `<main`, `<header`, `<footer`, `skip`, `Mona Sans` (in preload), `crossorigin`
- Canonical URL in built HTML points to `https://fair.pm/` not `localhost`
- Skip-to-content link targets `#main-content` and main element has `id="main-content"`

## Observability Impact

- Signals added/changed: SEO component validates prop types at build time via TypeScript; missing required props (title, description) cause build-time type errors
- How a future agent inspects this: Read built HTML in `dist/index.html`; grep for specific meta tags; `astro build` error output for type mismatches
- Failure state exposed: Missing SEO props → TypeScript error with component name and missing prop; broken canonical → visible in built HTML as localhost URL

## Inputs

- `src-astro/astro.config.mjs` — site URL used by SEO component for canonical URLs
- `src-astro/src/styles/global.css` — imported by BaseLayout for Tailwind + font styles
- `src-astro/public/fonts/monasansvf.woff2` — referenced by font preload link in BaseLayout
- S01-RESEARCH.md nav structure — exact links and hierarchy for Header component

## Expected Output

- `src-astro/src/components/SEO.astro` — full SEO meta tag component with typed Props interface
- `src-astro/src/components/Header.astro` — semantic nav skeleton with full site navigation
- `src-astro/src/components/Footer.astro` — semantic footer skeleton
- `src-astro/src/layouts/BaseLayout.astro` — HTML shell composing SEO, Header, main slot, Footer
- `src-astro/src/pages/index.astro` — homepage using BaseLayout with real SEO props
