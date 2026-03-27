# Project

## What This Is

A static website for fair.pm — the FAIR (Federated and Independent Repositories) project under the Linux Foundation. The site is being migrated from WordPress to Astro, deployed on Cloudflare Pages. It consists of ~18 static content pages and a 9-post blog. The `/packages/` section (plugin/theme explorer) is excluded and will be served by a separate standalone WordPress install.

## Core Value

A fast, accessible, SEO-complete static site that faithfully represents the FAIR project, with all existing content preserved and all existing URLs either maintained or properly redirected.

## Current State

The project is in planning. Research has been completed (`Fairly static/fair-pm-astro-migration-research.md`) and a preliminary project plan exists (`PROJECT-PLAN.md`). No code has been written yet. The source content lives in two places:
- **`fairpm/website-content` GitHub repo** — Markdown files for most static pages
- **Live WordPress site at fair.pm** — blog posts, homepage, roadmap page, and the "rethinking WordPress distribution" page (not in the content repo)

## Architecture / Key Patterns

- **Framework:** Astro (static output mode, TypeScript)
- **Styling:** Tailwind CSS with custom properties for brand tokens
- **Font:** Mona Sans (GitHub's variable font, self-hosted)
- **Content:** Blog posts as Astro content collection (Markdown + Zod schema); static pages as `.astro` files
- **Deployment:** Cloudflare Pages (pure static, no SSR adapter)
- **Content workflow:** GitHub PRs → auto-deploy on merge to main
- **Repo strategy:** Single repo for code + content (abstracted enough to split later)
- **`/packages/*` routing:** Cloudflare origin routing rule to separate WP install

## Capability Contract

See `.gsd/REQUIREMENTS.md` for the explicit capability contract, requirement status, and coverage mapping.

## Milestone Sequence

- [ ] M001: WordPress to Astro Migration — Migrate fair.pm from WordPress to a static Astro site on Cloudflare Pages with design refresh and SEO improvements
