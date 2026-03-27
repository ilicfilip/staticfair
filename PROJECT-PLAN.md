# fair.pm Static Site — Project Plan

## Overview

Migrate fair.pm from WordPress to Astro, deploying on Cloudflare Pages. The site has ~18 static content pages plus a 9-post blog. No dynamic features needed — the `/packages/` section will be handled separately by a standalone WordPress install.

**Goal:** Faster, lighter, more maintainable site with a light design refresh, strong accessibility, and improved SEO.

---

## Key Decisions (Resolved)

| Decision | Answer |
|----------|--------|
| **Packages section** | Excluded from migration. `/packages/*` will be served by a separate standalone WP install. The Astro site needs to link to it but not render it. |
| **Visual design** | Light refresh — keep the existing color palette and brand identity, modernize typography, spacing, and components. Strong focus on accessibility. |
| **Extra page** | `/rethinking-wordpress-distribution/` will be migrated (it's public, indexed, explains FAIR's mission). |
| **Deployment** | Pure static on Cloudflare Pages. No SSR adapter needed since packages are handled elsewhere. |

---

## Phase 1: Foundation

**Objective:** Astro project scaffolded, base layout working, homepage rendering with refreshed design.

### Tasks

- [ ] **1.1** Initialize Astro project with TypeScript, static output mode
- [ ] **1.2** Install core dependencies: `@astrojs/sitemap`, `@astrojs/mdx`, `@astrojs/rss`, `sharp`
- [ ] **1.3** Set up `styles/global.css` — migrate existing design tokens from WP theme (`--color-green: #25b372`, `--color-dark-blue: #003d5c`, etc.), modernize typography and spacing
- [ ] **1.4** Create `BaseLayout.astro` — HTML head, skip-to-content link, header, footer, slot
- [ ] **1.5** Create `SEO.astro` component — title, meta description (required prop), canonical URL, OG tags, Twitter Card tags, JSON-LD structured data
- [ ] **1.6** Create `Header.astro` — navigation (About, Packages link → external WP, Governance, Blog, Get Involved, Knowledge Base)
- [ ] **1.7** Create `Footer.astro` — governance links, Linux Foundation attribution
- [ ] **1.8** Build the homepage (`src/pages/index.astro`) as proof of concept
- [ ] **1.9** Add `public/robots.txt` with sitemap reference
- [ ] **1.10** Verify: homepage renders, SEO meta tags present, accessible, Lighthouse audit

---

## Phase 2: Blog Content Collection

**Objective:** Blog posts managed as a typed Markdown collection with listing page, individual posts, and RSS feed.

### Tasks

- [ ] **2.1** Define blog content collection schema in `src/content/config.ts` (title, date, description, author, tags, image — all validated with Zod)
- [ ] **2.2** Extract all 9 blog posts from WordPress (via WP REST API or WXR export) into Markdown files with proper frontmatter
- [ ] **2.3** Place in `src/content/blog/` with slug-based filenames
- [ ] **2.4** Create `BlogPost.astro` layout (extends BaseLayout, adds article markup, date, author, BlogPosting JSON-LD)
- [ ] **2.5** Create blog listing page (`src/pages/blog/index.astro`) — sorted by date, using `BlogCard.astro` component
- [ ] **2.6** Create dynamic blog post route (`src/pages/blog/[...slug].astro`)
- [ ] **2.7** Create RSS feed (`src/pages/rss.xml.ts`)
- [ ] **2.8** Verify: all 9 posts render, listing page works, RSS feed validates, schema catches errors at build time

---

## Phase 3: Static Pages Migration

**Objective:** All remaining pages migrated from `fairpm/website-content` repo + WordPress.

### Tasks

- [ ] **3.1** Pull content from `fairpm/website-content` repo as source material
- [ ] **3.2** Migrate **About** section (4 pages):
  - `/about/` — index
  - `/about/fairs-mandate/`
  - `/about/fair-initiatives/`
  - `/about/roadmap/`
- [ ] **3.3** Migrate **Governance** section (7 pages):
  - `/governance/` — index
  - `/governance/technical-steering-committee/`
  - `/governance/linux-foundation/`
  - `/governance/code-of-conduct/`
  - `/governance/antitrust-policy/`
  - `/governance/privacy-policy/`
  - `/governance/terms-of-use/`
- [ ] **3.4** Migrate **Get Involved** section (2 pages):
  - `/get-involved/` — index
  - `/get-involved/fair-working-groups/`
- [ ] **3.5** Migrate **Knowledge Base** (`/fair-knowledge-base/`)
- [ ] **3.6** Migrate **Rethinking WordPress Distribution** (`/rethinking-wordpress-distribution/`)
- [ ] **3.7** Migrate all images/assets — `src/assets/` for optimized images, `public/` for favicons/pass-through
- [ ] **3.8** Use Astro's `<Image>` component everywhere (WebP/AVIF, srcset, required alt text)
- [ ] **3.9** Content parity audit: page-by-page comparison of WP vs Astro (text, images, links, headings)

**Note:** `/packages/` is excluded — the nav links to the standalone WP install at `fair.pm/packages/`.

---

## Phase 4: SEO & Structured Data

**Objective:** Fix all SEO gaps from the current site; structured data is complete.

### Tasks

- [ ] **4.1** Write unique meta descriptions for every page (120-160 chars each)
- [ ] **4.2** Verify sitemap generation (`@astrojs/sitemap`, `site: 'https://fair.pm'`) — exclude `/packages/*` since that's a separate origin
- [ ] **4.3** Implement structured data:
  - `WebSite` on homepage (drop `SearchAction` unless Pagefind is added later)
  - `Organization` for FAIR / Linux Foundation
  - `BlogPosting` on each blog post (author, datePublished, dateModified)
  - `BreadcrumbList` on all pages
  - `WebPage` on standard pages
- [ ] **4.4** Audit semantic HTML: one `<h1>` per page, proper heading hierarchy, landmark elements (`<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`)
- [ ] **4.5** Validate structured data with Google Rich Results Test / Schema.org validator
- [ ] **4.6** Font loading: `font-display: swap`, preload critical fonts

---

## Phase 5: Accessibility

**Objective:** WCAG AA compliance throughout, with accessibility as a first-class concern.

### Tasks

- [ ] **5.1** Skip-to-content link in BaseLayout (already planned in 1.4)
- [ ] **5.2** All images have descriptive alt text (Astro `<Image>` enforces this)
- [ ] **5.3** Color contrast audit — verify all text meets 4.5:1 (normal) / 3:1 (large). Current theme colors need checking, especially `--color-green: #25b372` on white backgrounds.
- [ ] **5.4** Visible focus indicators on all interactive elements (links, buttons, nav items) — the current theme already has outline-on-hover patterns, ensure focus matches
- [ ] **5.5** ARIA landmarks: `<nav>`, `<main>`, `<article>`, roles on header/footer regions
- [ ] **5.6** Keyboard navigation: full Tab order testing, Enter/Space activation, Escape to close menus
- [ ] **5.7** Mobile navigation: ensure hamburger menu is keyboard-accessible and screen-reader friendly
- [ ] **5.8** Run axe-core + Lighthouse accessibility audits, fix all issues
- [ ] **5.9** Test with screen reader (VoiceOver) on key pages: homepage, a blog post, governance page

---

## Phase 6: Deployment & Redirects

**Objective:** Site live on Cloudflare Pages with all WordPress URLs redirecting correctly.

### Tasks

- [ ] **6.1** Connect GitHub repo to Cloudflare Pages (auto-deploy on push to `main`)
- [ ] **6.2** Add `public/_redirects` with 301 redirects:
  - 9 blog post URL rewrites (drop date segments from WordPress URLs)
  - WordPress infrastructure URLs (`/wp-admin/*`, `/wp-login.php`, `/wp-content/*`, `/wp-json/*`, `/xmlrpc.php` → `/`)
  - `/feed/` → `/rss.xml`
- [ ] **6.3** Configure `/packages/*` routing — Cloudflare route rule to forward `/packages/*` requests to the standalone WP origin (path-based origin routing, not a redirect, so the URL stays on `fair.pm`)
- [ ] **6.4** Add `public/_headers`:
  - `X-Robots-Tag: noindex` on all `*.pages.dev` URLs
  - Cache headers: immutable for hashed assets, 1h for HTML
- [ ] **6.5** Set up GitHub Actions workflow for CI build + deploy
- [ ] **6.6** Deploy to staging and validate everything
- [ ] **6.7** Verify `pages.dev` URLs return `X-Robots-Tag: noindex`

---

## Phase 7: Go-Live & Cutover

**Objective:** DNS pointed to Cloudflare Pages, no SEO regressions, WP decommissioned (except packages).

### Tasks

- [ ] **7.1** Final content parity audit (every page, every image, every link)
- [ ] **7.2** Full Lighthouse audit (Performance, Accessibility, SEO, Best Practices)
- [ ] **7.3** Validate all redirects with `curl -I`
- [ ] **7.4** Verify `/packages/` routes correctly to standalone WP install
- [ ] **7.5** Point `fair.pm` DNS to Cloudflare Pages
- [ ] **7.6** Verify production domain does NOT have `X-Robots-Tag: noindex`
- [ ] **7.7** Set canonical domain in Cloudflare dashboard
- [ ] **7.8** Submit updated sitemap to Google Search Console
- [ ] **7.9** Monitor Search Console for crawl errors over next 2-4 weeks
- [ ] **7.10** Decommission main WordPress installation (keep standalone packages WP)

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Content missed during migration | Lost pages, broken user journeys | Page-by-page audit (3.9, 7.1) |
| Broken URLs → SEO ranking loss | Organic traffic drops | Comprehensive redirect map (6.2), Search Console monitoring (7.9) |
| `pages.dev` indexed by Google | Duplicate content penalty | `X-Robots-Tag: noindex` on staging (6.4) |
| Blog posts published on WP before cutover | Missing content + missing redirects | Track new WP posts, add to migration + redirect list |
| `/packages/` routing between Astro and standalone WP | Broken navigation, split-origin issues | Test routing thoroughly (6.3, 7.4), plan CORS/cookie handling if needed |
| Color contrast fails with current palette | Accessibility violations | Audit early in Phase 1 (5.3), adjust colors in refresh |
| External link rot (GitHub URLs) | Broken links on site | Link validation in CI or periodic checks |

---

## Page Inventory (18 pages + 9 blog posts)

### Static Pages (18)
| URL | Content Source |
|-----|---------------|
| `/` | WordPress (homepage) |
| `/about/` | `website-content/about/index.md` |
| `/about/fairs-mandate/` | `website-content/about/fairs-mandate.md` |
| `/about/fair-initiatives/` | `website-content/about/fair-initiatives.md` |
| `/about/roadmap/` | WordPress (not in content repo) |
| `/governance/` | `website-content/governance/index.md` |
| `/governance/technical-steering-committee/` | `website-content/governance/technical-steering-committee.md` |
| `/governance/linux-foundation/` | `website-content/governance/linux-foundation.md` |
| `/governance/code-of-conduct/` | `website-content/governance/code-of-conduct.md` |
| `/governance/antitrust-policy/` | `website-content/governance/antitrust-policy.md` |
| `/governance/privacy-policy/` | `website-content/governance/privacy-policy.md` |
| `/governance/terms-of-use/` | `website-content/governance/terms-of-use.md` |
| `/get-involved/` | `website-content/get-involved/index.md` |
| `/get-involved/fair-working-groups/` | `website-content/get-involved/fair-working-groups.md` |
| `/fair-knowledge-base/` | `website-content/fair-knowledge-base.md` |
| `/rethinking-wordpress-distribution/` | WordPress (not in content repo) |
| `/blog/` | Blog listing (generated from collection) |

### Blog Posts (9) — Content Collection
| Date | Slug | Source |
|------|------|--------|
| 2025-08-20 | `fair-plugin-version-0-4-0-decentralized-installation` | WordPress |
| 2025-09-24 | `discover-trust-install-fair-1-0-is-here` | WordPress |
| 2025-11-04 | `what-is-fair` | WordPress |
| 2025-11-09 | `fair-plugin-1-1-release-announcement` | WordPress |
| 2025-12-11 | `fair-connect-1-2-release-announcement` | WordPress |
| 2025-12-22 | `fair-connect-1-2-1-release-announcement` | WordPress |
| 2025-12-24 | `fair-connect-1-2-2-release-announcement` | WordPress |
| 2026-01-25 | `2025-fair-recap` | WordPress |
| 2026-02-26 | `second-star-to-the-right-and-straight-on-till-morning` | WordPress |

### Excluded (handled by standalone WP)
- `/packages/`
- `/packages/plugins/` (+ ~6,000 paginated plugin pages)
- `/packages/themes/` (+ ~1,400 paginated theme pages)

---

## File Structure (Target)

```
fair-pm/
├── astro.config.mjs
├── tsconfig.json
├── package.json
├── public/
│   ├── robots.txt
│   ├── _redirects
│   ├── _headers
│   ├── favicon.ico
│   └── fonts/
├── src/
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── BlogPost.astro
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── SEO.astro
│   │   └── BlogCard.astro
│   ├── content/
│   │   ├── config.ts
│   │   └── blog/
│   │       ├── discover-trust-install-fair-1-0-is-here.md
│   │       ├── what-is-fair.md
│   │       └── ... (9 posts total)
│   ├── pages/
│   │   ├── index.astro
│   │   ├── rss.xml.ts
│   │   ├── about/
│   │   ├── governance/
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [...slug].astro
│   │   ├── get-involved/
│   │   ├── fair-knowledge-base/
│   │   └── rethinking-wordpress-distribution.astro
│   ├── assets/
│   │   └── images/
│   └── styles/
│       └── global.css
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## Design Tokens (from current WP theme)

These are the existing brand colors to carry forward into the refresh:

```css
:root {
  --color-green: #25b372;
  --color-orange: #ffaa00;
  --color-red: #970101;
  --color-blue: #0073aa;
  --color-dark-blue: #003d5c;
  --color-light-blue: #66b3d6;
  --color-black: #000;
  --color-white: #fff;
  --color-light-gray: #f6f6f7;
  --color-dark-gray: #565757;
  --color-transparent-gray: #e6e6e7dd;
}
```

**Accessibility note:** `--color-green: #25b372` on white (#fff) has a contrast ratio of ~3.2:1 — fails WCAG AA for normal text (needs 4.5:1). This needs adjustment during the refresh. `--color-dark-gray: #565757` on white is ~5.0:1 — passes AA for normal text but fails AAA.
