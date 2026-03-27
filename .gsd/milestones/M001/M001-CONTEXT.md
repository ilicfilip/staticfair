# M001: WordPress to Astro Migration — Context

**Gathered:** 2026-03-27
**Status:** Ready for planning

## Project Description

Migrate fair.pm from a WordPress installation to a static Astro site deployed on Cloudflare Pages. The site is a content-heavy, mostly static website for the FAIR (Federated and Independent Repositories) project under the Linux Foundation. It has ~18 static pages and a 9-post blog. The migration includes a light design refresh with strong accessibility focus, comprehensive SEO improvements, and deployment automation.

## Why This Milestone

The current WordPress site ships significant JS/CSS bloat for what is essentially static content (jQuery, Gutenberg styles, block library CSS, prefetch scripts, lightbox JS). It's missing critical SEO elements (no robots.txt, no sitemap, no meta descriptions, no canonical URLs, no Twitter Cards). The WordPress installation is maintenance overhead for a site that doesn't use any dynamic features. Astro eliminates all of this — zero JS by default, built-in image optimization, content collections with schema validation, and native static site generation.

## User-Visible Outcome

### When this milestone is complete, the user can:

- Visit fair.pm and see the full site rendered as static HTML from Astro, with all content intact and a refreshed visual design
- Navigate between all pages including About, Governance, Blog, Get Involved, Knowledge Base, and follow links to /packages/ (served by separate WP)
- Read all 9 blog posts with correct content, dates, and images
- Subscribe to the RSS feed at /rss.xml
- See correct meta tags, structured data, and sitemap when inspecting the site

### Entry point / environment

- Entry point: https://fair.pm (production) and *.pages.dev (staging)
- Environment: Cloudflare Pages (static hosting), browser
- Live dependencies involved: Cloudflare Pages, Cloudflare DNS, separate WordPress origin for /packages/*

## Completion Class

- Contract complete means: all pages render correctly, all redirects work, all SEO tags present, Lighthouse scores ≥90 across all categories, WCAG AA compliance verified
- Integration complete means: Cloudflare Pages serves the static site, /packages/* routes to WP origin, DNS resolves correctly
- Operational complete means: GitHub push to main triggers auto-deploy, staging has noindex headers, production does not

## Final Integrated Acceptance

To call this milestone complete, we must prove:

- All 18 static pages + 9 blog posts render with correct content at their expected URLs
- All old WordPress blog URLs return 301 redirects to the new clean URLs
- /packages/ links in the nav correctly reach the standalone WP install
- Lighthouse audit scores ≥90 on Performance, Accessibility, SEO, and Best Practices
- RSS feed validates and contains all 9 posts
- Sitemap exists and includes all pages (excluding /packages/*)

## Risks and Unknowns

- **Cloudflare origin routing for /packages/*** — Cloudflare Pages doesn't natively proxy to a second origin. This requires either Cloudflare Origin Rules (enterprise-ish), a Cloudflare Worker, or Cloudflare for SaaS. The exact mechanism needs to be verified during deployment planning.
- **Content parity** — Some pages are in the content repo, others only in WordPress. Blog post images may be hosted on WordPress and need extraction.
- **Mona Sans font licensing and hosting** — The font is self-hosted in the current theme. Need to confirm it's properly included and licensed for the new site (it's open source, MIT licensed by GitHub).
- **Green color contrast** — #25b372 on white is 3.2:1 (fails WCAG AA). The adjusted green must still feel "on brand" while meeting 4.5:1.

## Existing Codebase / Prior Art

- `Fairly static/fair-pm-astro-migration-research.md` — comprehensive migration research including URL redirect map, SEO analysis, package recommendations, and deployment strategy
- `PROJECT-PLAN.md` — preliminary project plan (pre-GSD, will be superseded by this roadmap)
- **fairpm/website-content** (GitHub) — Markdown content for most static pages, images in assets/
- **fair.pm** (live WordPress) — source of truth for blog posts, homepage, roadmap page, rethinking-wordpress-distribution page
- **fair-parent-theme** (WP theme) — CSS custom properties, Mona Sans font, design tokens to carry forward

> See `.gsd/DECISIONS.md` for all architectural and pattern decisions — it is an append-only register; read it during planning, append to it during execution.

## Relevant Requirements

- R001–R003 — Core content migration (pages, blog, RSS)
- R004–R005 — SEO (meta tags, structured data, sitemap)
- R006 — URL preservation and redirects
- R007 — Accessibility (WCAG AA)
- R008–R009 — Image optimization and responsive design
- R010–R011 — Deployment and /packages/* routing
- R012–R013 — Design refresh and placeholder branding
- R014 — robots.txt

## Scope

### In Scope

- All 18 static pages migrated to Astro
- 9 blog posts as content collection
- Light design refresh with Tailwind CSS and Mona Sans
- SEO improvements (everything missing from current site)
- WCAG AA accessibility
- Cloudflare Pages deployment with CI/CD
- /packages/* routing configuration and documentation
- URL redirects for all changed paths
- Placeholder logo and favicon

### Out of Scope / Non-Goals

- Package explorer (/packages/*) — handled by standalone WP
- Site search — deferred
- Headless CMS — deferred
- Final branding — deferred (placeholder only)
- SSR — not needed
- User accounts, comments, e-commerce

## Technical Constraints

- Astro static output mode only (no SSR adapter)
- Tailwind CSS for styling (with CSS custom properties for brand tokens)
- Content collection for blog posts only (static pages as .astro files)
- Single repo for code + content (but abstracted enough to split later)
- Mona Sans variable font, self-hosted (not CDN)
- TypeScript enabled

## Integration Points

- **Cloudflare Pages** — static hosting, _redirects, _headers, auto-deploy
- **Cloudflare DNS** — domain resolution for fair.pm
- **Cloudflare routing** — origin rules or Worker for /packages/* to WP origin
- **GitHub** — repo hosting, GitHub Actions CI/CD, PR-based content workflow
- **WordPress REST API** — one-time data extraction for blog posts (read-only, during migration)
- **fairpm/website-content repo** — one-time content pull for static pages

## Open Questions

- **Exact Cloudflare routing mechanism for /packages/*** — Origin Rules vs Worker vs Cloudflare for SaaS. Will research during deployment slice and include step-by-step instructions for the chosen approach.
- **WordPress origin URL for /packages/*** — What's the hostname/IP of the standalone WP install? Needed for routing config. This can be deferred until deployment.

## Reference Paths

When implementing, read these files for content and design reference:

- **Research document:** `Fairly static/fair-pm-astro-migration-research.md`
- **Design tokens (colors):** Extract from live theme CSS at `https://fair.pm/content/themes/fair-parent-theme/style.css`
- **Typography tokens:** Extract from `https://fair.pm/content/themes/fair-parent-theme/css/dev/global.css`
- **Font file:** `https://fair.pm/content/themes/fair-parent-theme/fonts/monasansvf.woff2`
- **Page content (static):** `https://github.com/fairpm/website-content`
- **Blog posts (API):** `https://fair.pm/wp-json/wp/v2/posts?per_page=100`
- **Page list (API):** `https://fair.pm/wp-json/wp/v2/pages?per_page=100`
- **Nav structure:** Extracted from live homepage HTML (see research notes in this file's parent milestone research)

## Design Tokens to Carry Forward

```css
/* Colors (from fair-parent-theme style.css) */
:root {
  --color-green: #25b372;       /* ⚠️ Fails AA on white (3.2:1) — adjust to ≥4.5:1 */
  --color-orange: #ffaa00;
  --color-red: #970101;
  --color-blue: #0073aa;
  --color-dark-blue: #003d5c;
  --color-light-blue: #66b3d6;
  --color-black: #000;
  --color-white: #fff;
  --color-light-gray: #f6f6f7;
  --color-dark-gray: #565757;   /* 5.0:1 on white — passes AA normal, fails AAA */
  --color-transparent-gray: #e6e6e7dd;
}

/* Typography (from fair-parent-theme global.css) */
:root {
  --typography-family-main: "Mona Sans", -apple-system, "BlinkMacSystemFont", "Segoe UI", "Roboto", "Oxygen-Sans", "Ubuntu", "Cantarell", "Helvetica Neue", sans-serif;
  --typography-paragraph-size: 1.125rem;  /* 18px */
  --typography-h1-size: 2.5rem;
  --typography-h2-size: 1.875rem;
  --typography-h3-size: 1.5rem;
  --typography-h4-size: 1.25rem;
  --typography-heading-line-height: 1.2;
  --typography-paragraph-line-height: 1.7;
  --typography-weight-regular: 400;
  --typography-weight-medium: 500;
  --typography-weight-semibold: 600;
  --typography-weight-bold: 700;
}
```

## Page Inventory

### Static Pages (18)
| URL | Content Source |
|-----|---------------|
| `/` | WordPress homepage |
| `/about/` | website-content/about/index.md |
| `/about/fairs-mandate/` | website-content/about/fairs-mandate.md |
| `/about/fair-initiatives/` | website-content/about/fair-initiatives.md |
| `/about/roadmap/` | WordPress only (not in content repo) |
| `/governance/` | website-content/governance/index.md |
| `/governance/technical-steering-committee/` | website-content/governance/technical-steering-committee.md |
| `/governance/linux-foundation/` | website-content/governance/linux-foundation.md |
| `/governance/code-of-conduct/` | website-content/governance/code-of-conduct.md |
| `/governance/antitrust-policy/` | website-content/governance/antitrust-policy.md |
| `/governance/privacy-policy/` | website-content/governance/privacy-policy.md |
| `/governance/terms-of-use/` | website-content/governance/terms-of-use.md |
| `/get-involved/` | website-content/get-involved/index.md |
| `/get-involved/fair-working-groups/` | website-content/get-involved/fair-working-groups.md |
| `/fair-knowledge-base/` | website-content/fair-knowledge-base.md |
| `/rethinking-wordpress-distribution/` | WordPress only |
| `/blog/` | Blog listing (generated) |

### Blog Posts (9) — via WP REST API
| Date | Slug |
|------|------|
| 2025-08-20 | fair-plugin-version-0-4-0-decentralized-installation |
| 2025-09-24 | discover-trust-install-fair-1-0-is-here |
| 2025-11-04 | what-is-fair |
| 2025-11-09 | fair-plugin-1-1-release-announcement |
| 2025-12-11 | fair-connect-1-2-release-announcement |
| 2025-12-22 | fair-connect-1-2-1-release-announcement |
| 2025-12-24 | fair-connect-1-2-2-release-announcement |
| 2026-01-25 | 2025-fair-recap |
| 2026-02-26 | second-star-to-the-right-and-straight-on-till-morning |

### Nav Structure
```
About FAIR
  ├── FAIR's Mandate
  ├── FAIR Initiatives
  └── Roadmap
Packages → (external link to /packages/ on WP origin)
  ├── Plugins
  └── Themes
Governance
  ├── Technical Steering Committee
  ├── Linux Foundation
  ├── Code of Conduct
  ├── Antitrust Policy
  ├── Privacy Policy
  └── Terms of Use
Blog
Get Involved
  ├── Join Slack (external: chat.fair.pm)
  ├── Join a Meeting (external: zoom-lfx.platform.linuxfoundation.org)
  └── FAIR Working Groups
Knowledge Base
```
