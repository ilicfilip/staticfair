# M001: WordPress to Astro Migration

**Vision:** Migrate fair.pm from WordPress to a static Astro site on Cloudflare Pages. All 18 pages and 9 blog posts migrated with a light design refresh, comprehensive SEO improvements, WCAG AA accessibility, and deployment automation. The /packages/ section is excluded (served by standalone WP).

## Success Criteria

- All 18 static pages render with correct content at their preserved URLs
- All 9 blog posts render from content collection with validated schema
- Blog listing page shows all posts sorted by date
- RSS feed at /rss.xml contains all posts and validates
- Every page has meta description, canonical URL, OG tags, Twitter Cards, and JSON-LD structured data
- Sitemap generated and includes all pages (excluding /packages/*)
- All old WordPress blog URLs 301 redirect to new clean URLs
- WordPress infrastructure URLs (/wp-admin/*, /wp-json/*, etc.) redirect to /
- Lighthouse scores ≥90 on Performance, Accessibility, SEO, and Best Practices
- WCAG AA color contrast ratios met throughout
- Site works on mobile, tablet, and desktop viewports
- /packages/* links in nav correctly reach standalone WP install
- GitHub push to main triggers auto-deploy to Cloudflare Pages
- Staging (*.pages.dev) has X-Robots-Tag: noindex

## Key Risks / Unknowns

- **Cloudflare /packages/* routing** — Cloudflare Pages doesn't natively proxy to a second origin. Mechanism (Origin Rules, Worker, or redirect) needs verification. This is a configuration-only task but could block go-live if the approach doesn't work.
- **WordPress content extraction completeness** — Blog post images, embedded media, and formatting may not transfer cleanly from WP REST API to Markdown. Manual cleanup likely needed.
- **Green color contrast fix** — Adjusting #25b372 to pass WCAG AA while staying visually "on brand" requires design judgment, not just a formula.

## Proof Strategy

- **Cloudflare routing** → retire in S05 by documenting the exact Cloudflare config steps and verifying with curl that /packages/ requests reach the WP origin (or documenting that this can only be verified when both origins are live)
- **Content extraction** → retire in S03 by extracting all 9 posts and verifying content/image parity with live WP site
- **Color contrast** → retire in S02 by adjusting green and verifying all color combinations pass WCAG AA checker

## Verification Classes

- Contract verification: Lighthouse audits (perf, a11y, SEO, best practices), HTML validator, structured data validator, RSS validator, link checker, axe-core
- Integration verification: curl redirects, Cloudflare Pages deploy, /packages/* routing
- Operational verification: GitHub Actions deploy pipeline, staging noindex headers
- UAT / human verification: visual design review, content parity spot-check, VoiceOver screen reader test

## Milestone Definition of Done

This milestone is complete only when all are true:

- All 5 slices are complete with passing verification
- All 18 pages + 9 blog posts render correctly with refreshed design
- SEO component is wired into every page with unique meta descriptions
- All redirects work (verified with curl)
- Lighthouse ≥90 on all four categories for homepage and one blog post
- RSS feed validates
- Sitemap includes all non-packages pages
- Cloudflare Pages deployment is automated and documented
- /packages/* routing instructions are complete (even if not exercisable until WP origin is live)

## Requirement Coverage

- Covers: R001, R002, R003, R004, R005, R006, R007, R008, R009, R010, R011, R012, R013, R014
- Partially covers: none
- Leaves for later: R015 (search), R016 (CMS), R017 (branding), R018 (i18n)
- Orphan risks: none

## Slices

- [x] **S01: Astro Foundation & Layout System** `risk:medium` `depends:[]`
  > After this: `astro dev` serves a working homepage at localhost with BaseLayout, Header, Footer, SEO component, Tailwind CSS, Mona Sans font, and refreshed design tokens. No content pages yet, but the full layout shell is demoable.

- [x] **S02: Design Refresh & Accessibility** `risk:medium` `depends:[S01]`
  > After this: Homepage has the full refreshed visual design with WCAG AA-compliant colors, responsive layout, placeholder logo/favicon, visible focus indicators, skip-to-content link, and keyboard-navigable header/nav. Lighthouse accessibility score ≥90 on homepage.

- [x] **S03: Content Migration** `risk:medium` `depends:[S01]`
  > After this: All 18 static pages and 9 blog posts render with correct content. Blog listing page shows posts sorted by date. RSS feed at /rss.xml validates. Images optimized via Astro Image component. Content parity verified against live WP site.

- [x] **S04: SEO & Structured Data** `risk:low` `depends:[S01,S03]`
  > After this: Every page has unique meta description, canonical URL, OG tags, Twitter Cards, and JSON-LD structured data. Sitemap generated. Structured data validates with Google Rich Results Test. Semantic HTML audited (one h1 per page, proper heading hierarchy, landmark elements).

- [x] **S05: Deployment & Redirects** `risk:medium` `depends:[S01,S02,S03,S04]`
  > After this: Site deploys to Cloudflare Pages via GitHub Actions on push to main. All 301 redirects work (verified with curl on staging). robots.txt present. Staging has X-Robots-Tag: noindex. _headers file configures cache strategy. Step-by-step Cloudflare setup docs included. /packages/* routing instructions documented.

## Boundary Map

### S01 → S02

Produces:
- `src/layouts/BaseLayout.astro` — HTML shell with head, skip link slot, header, main slot, footer
- `src/components/Header.astro` — nav structure (unstyled skeleton with correct links and hierarchy)
- `src/components/Footer.astro` — footer structure (unstyled skeleton)
- `src/components/SEO.astro` — meta tag component accepting title, description, canonical, OG, Twitter Card, JSON-LD props
- `tailwind.config.mjs` — Tailwind config with brand color tokens (raw values from WP theme, pre-contrast-fix)
- `src/styles/global.css` — Tailwind directives, Mona Sans @font-face, CSS custom properties for brand tokens
- `public/fonts/monasansvf.woff2` — self-hosted Mona Sans variable font file

Consumes:
- nothing (first slice)

### S01 → S03

Produces:
- `src/layouts/BaseLayout.astro` — layout shell for wrapping content pages
- `src/components/SEO.astro` — SEO component for content page meta tags
- Astro project config (`astro.config.mjs`) — site URL, integrations, Tailwind

Consumes:
- nothing (first slice)

### S01 → S04

Produces:
- `src/components/SEO.astro` — SEO component that S04 extends with structured data types
- `src/layouts/BaseLayout.astro` — layout where SEO component is wired in

Consumes:
- nothing (first slice)

### S02 → S05

Produces:
- Complete styled components (Header, Footer, all visual design applied)
- Placeholder logo SVG and favicon files in `public/`
- Accessible, responsive layout verified with Lighthouse

Consumes from S01:
- BaseLayout, Header, Footer, SEO component, Tailwind config, global.css, font files

### S03 → S04

Produces:
- `src/content/config.ts` — blog collection schema (title, date, description, author, tags, image)
- `src/content/blog/*.md` — all 9 blog post Markdown files with validated frontmatter
- `src/layouts/BlogPost.astro` — blog post layout
- `src/pages/blog/index.astro` — blog listing page
- `src/pages/blog/[...slug].astro` — dynamic blog post route
- `src/pages/rss.xml.ts` — RSS feed endpoint
- All static page `.astro` files in `src/pages/` with content migrated
- `src/assets/images/` — all migrated and optimized images

Consumes from S01:
- BaseLayout, SEO component, Astro project config

### S04 → S05

Produces:
- Unique meta descriptions on every page (wired through SEO component)
- JSON-LD structured data on every page (WebSite, Organization, BlogPosting, BreadcrumbList, WebPage)
- Sitemap configuration in `astro.config.mjs` (excluding /packages/*)
- All semantic HTML audited and corrected

Consumes from S01:
- SEO component
Consumes from S03:
- Blog collection schema, all page files, blog post layout

### S05 (final assembly)

Produces:
- `public/_redirects` — all 301 redirects (blog URLs, WP infrastructure URLs, /feed/)
- `public/_headers` — cache strategy, staging noindex
- `public/robots.txt` — with sitemap reference
- `.github/workflows/deploy.yml` — CI/CD pipeline
- `docs/cloudflare-setup.md` — step-by-step Cloudflare Pages, DNS, and /packages/* routing instructions
- Verified: all redirects work, staging deploys successfully, noindex headers present on *.pages.dev

Consumes from S01:
- Astro project config
Consumes from S02:
- Complete styled site
Consumes from S03:
- All content pages and blog posts
Consumes from S04:
- SEO tags, structured data, sitemap config
