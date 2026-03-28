# Project

## What This Is

A static website for fair.pm — the FAIR (Federated and Independent Repositories) project under the Linux Foundation. The site is being migrated from WordPress to Astro, deployed on Cloudflare Pages. It consists of ~18 static content pages and a 9-post blog. The `/packages/` section (plugin/theme explorer) is excluded and will be served by a separate standalone WordPress install.

## Core Value

A fast, accessible, SEO-complete static site that faithfully represents the FAIR project, with all existing content preserved and all existing URLs either maintained or properly redirected.

## Current State

**S01 + S02 + S03 + S04 complete.** The Astro site has full visual design, WCAG AA accessibility, all content migrated, and complete SEO layer. Built and verified in `src-astro/`:

- Astro 6.1.1 with static output, TypeScript strict, site URL `https://fair.pm`
- Tailwind CSS v4 with 10 brand color tokens (green updated to #1a7f53 for AA compliance)
- Mona Sans variable font, base typography scale (body 18px/1.7, responsive heading sizes)
- Styled header: blue background, responsive nav with CSS dropdowns, mobile hamburger with ARIA
- Linux Foundation attribution banner above header
- Styled footer: dark-blue background, white text, LF attribution, back-to-top link
- Homepage: hero section, CTA cards, feature list, get-involved section
- Placeholder FAIR logo SVG and favicon (SVG + ICO)
- Global focus-visible indicators (blue on light, white on dark backgrounds)
- Skip-to-content link, all ARIA landmarks, prefers-reduced-motion
- Lighthouse accessibility: 100% (homepage)
- 9 blog posts as Zod-validated Markdown content collection with listing page, dynamic routing, and RSS feed
- 15 static pages at preserved WP URLs (about, governance, get-involved, knowledge base, roadmap, rethinking-wordpress-distribution)
- 5 blog images optimized to WebP via Astro pipeline
- 1 MP4 video for HTML5 video element
- YouTube/SpeakerDeck embeds with responsive wrappers
- Content parity verified against live WP site
- JSON-LD structured data on all 26 pages (WebSite, Organization, BlogPosting, WebPage, BreadcrumbList)
- OG tags (og:site_name, og:locale, og:image with SVG fallback), Twitter Cards on every page
- Sitemap with 26 URLs, /packages/* excluded, linked from every page
- All meta descriptions ≤160 chars, heading hierarchy correct site-wide
- `astro build` exits 0 with 26 pages + RSS + sitemaps, dev server responds 200

Next: S05 (Deployment & Redirects).

## Architecture / Key Patterns

- **Framework:** Astro 6.1.1 (static output mode, TypeScript strict)
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite`, CSS-first config with `@theme` directive in global.css
- **Font:** Mona Sans variable font, self-hosted, inline @font-face in BaseLayout + global.css
- **Content:** Blog posts as Astro content collection (Markdown + Zod schema); static pages as `.astro` files
- **SEO:** Custom SEO.astro component with typed Props; canonical URL auto-computed from Astro.site
- **Layout:** BaseLayout.astro wraps all pages — accepts SEO props and passes through to SEO component
- **Deployment:** Cloudflare Pages (pure static, no SSR adapter)
- **Content workflow:** GitHub PRs → auto-deploy on merge to main
- **Repo strategy:** Single repo for code + content, Astro project in `src-astro/` subdirectory

## Capability Contract

See `.gsd/REQUIREMENTS.md` for the explicit capability contract, requirement status, and coverage mapping.

## Milestone Sequence

- [ ] M001: WordPress to Astro Migration — Migrate fair.pm from WordPress to a static Astro site on Cloudflare Pages with design refresh and SEO improvements
