---
id: T02
parent: S01
milestone: M001
provides:
  - SEO.astro component with typed Props interface (title, description, canonicalURL, ogImage, ogType, twitterCard, jsonLd, noindex)
  - BaseLayout.astro HTML shell with SEO, font preload, skip-to-content, Header, main slot, Footer
  - Header.astro semantic nav skeleton with full site navigation structure
  - Footer.astro semantic footer skeleton with essential links
key_files:
  - src-astro/src/components/SEO.astro
  - src-astro/src/layouts/BaseLayout.astro
  - src-astro/src/components/Header.astro
  - src-astro/src/components/Footer.astro
  - src-astro/src/pages/index.astro
key_decisions:
  - SEO component defaults canonicalURL via new URL(Astro.url.pathname, Astro.site) — produces https://fair.pm/ in builds
  - Twitter image tag reuses ogImage prop (no separate twitterImage prop) to keep the interface simple
  - Footer includes copyright year computed at build time via new Date().getFullYear()
  - External links (Slack, Zoom) use rel="noopener noreferrer" target="_blank" with sr-only external link indicator
patterns_established:
  - BaseLayout accepts same Props interface as SEO and passes them through — pages only need to set props once
  - Semantic ARIA landmarks: header with nav aria-label="Main", footer with nav aria-label="Footer", main id="main-content"
  - Skip-to-content link uses sr-only/focus:not-sr-only Tailwind pattern
observability_surfaces:
  - Missing required SEO props (title, description) cause TypeScript build-time errors
  - Built HTML in dist/index.html can be grepped for meta tags, canonical URL, semantic elements
  - Canonical URL in built output verifies site config correctness (localhost = broken config)
duration: 10m
verification_result: passed
completed_at: 2026-03-27
blocker_discovered: false
---

# T02: Build BaseLayout, Header skeleton, Footer skeleton, and SEO component

**Built SEO.astro with full meta tag rendering, BaseLayout.astro HTML shell, Header.astro with complete nav hierarchy, Footer.astro with essential links, and wired index.astro through the layout pipeline — canonical URL resolves to https://fair.pm/, all semantic landmarks present.**

## What Happened

Created four components and updated the homepage:

1. **SEO.astro** — Full Props interface with typed defaults. Renders title, meta description, canonical link, OG tags (title, description, url, type), Twitter Card tags (card, title, description), conditional OG/Twitter image, conditional noindex meta, and conditional JSON-LD script tag. canonicalURL defaults to `new URL(Astro.url.pathname, Astro.site)`.

2. **Header.astro** — Semantic `<header>` with `<nav aria-label="Main">`. Contains full site navigation: About (3 sub-items), Packages (2 sub-items), Governance (6 sub-items), Blog, Get Involved (3 sub-items with external links), Knowledge Base. External links (Slack, Zoom) marked with `rel="noopener noreferrer" target="_blank"` and sr-only external link indicator.

3. **Footer.astro** — Semantic `<footer>` with `<nav aria-label="Footer">` containing Privacy Policy, Terms of Use, Code of Conduct links. Copyright notice with dynamic year.

4. **BaseLayout.astro** — HTML shell: `<html lang="en">`, `<head>` with charset, viewport, SEO component, font preload with crossorigin, global.css import. `<body>` with skip-to-content link (sr-only + focus:not-sr-only pattern), Header, `<main id="main-content">` with slot, Footer. Props interface mirrors SEO.astro for pass-through.

5. **index.astro** — Updated to use BaseLayout with real SEO props (title and description).

## Verification

- `npm run build` exits 0 — PASS
- Built `dist/index.html` contains all required elements:
  - `lang="en"` — PASS
  - `<meta name="description"` — PASS
  - `og:title`, `og:description`, `og:url`, `og:type` — PASS
  - `twitter:card`, `twitter:title`, `twitter:description` — PASS
  - `rel="canonical"` with `https://fair.pm/` — PASS
  - `<nav`, `<main`, `<header`, `<footer` — PASS
  - `skip` (skip-to-content link) — PASS
  - `crossorigin` on font preload — PASS
  - `Mona Sans` in CSS output — PASS
- Canonical URL is `https://fair.pm/` (not localhost) — PASS
- Skip-to-content link targets `#main-content`, main element has `id="main-content"` — PASS
- No localhost URLs in built HTML — PASS

Slice-level checks: V1 ✓, V3 ✓, V5 ✓, V6 ✓. V2 (dev server) not re-run (T01 verified). V4 (content config) is T03 scope.

## Diagnostics

- Inspect built HTML: `cat src-astro/dist/index.html`
- Grep for specific meta tags: `grep -i "og:title\|canonical\|twitter:card" src-astro/dist/index.html`
- Verify canonical URL: `grep "canonical" src-astro/dist/index.html` — should show `https://fair.pm/`
- Missing SEO props → TypeScript error at build time with component name and missing prop
- Broken site config → canonical URL shows localhost instead of fair.pm

## Deviations

None.

## Known Issues

- V3 slice check for "Mona Sans" only passes when checking combined HTML + CSS output (the `@font-face` declaration with the font family name is in the CSS bundle, not inline HTML). The preload link in HTML references the woff2 filename. This is correct behavior.

## Files Created/Modified

- `src-astro/src/components/SEO.astro` — SEO meta tag component with full typed Props interface
- `src-astro/src/components/Header.astro` — Semantic nav skeleton with complete site navigation hierarchy
- `src-astro/src/components/Footer.astro` — Semantic footer with essential links and copyright
- `src-astro/src/layouts/BaseLayout.astro` — HTML shell composing SEO, Header, main slot, Footer
- `src-astro/src/pages/index.astro` — Updated to use BaseLayout with real SEO props
