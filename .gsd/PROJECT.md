# Project

## What This Is

A static website for fair.pm — the FAIR (Federated and Independent Repositories) project under the Linux Foundation. The site is being migrated from WordPress to Astro, deployed on Cloudflare Pages. It consists of ~18 static content pages and a 9-post blog. The `/packages/` section (plugin/theme explorer) is excluded and will be served by a separate standalone WordPress install.

## Core Value

A fast, accessible, SEO-complete static site that faithfully represents the FAIR project, with all existing content preserved and all existing URLs either maintained or properly redirected.

## Current State

**S01 + S02 complete.** The Astro site has a full visual design with WCAG AA accessibility. Built and verified in `src-astro/`:

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
- Lighthouse accessibility: 100%
- Blog content collection schema (Zod-validated, empty — awaiting S03)
- `astro build` exits 0, dev server responds 200

Next: S03 (Content Migration) or S04 (SEO & Structured Data, depends on S03).

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
