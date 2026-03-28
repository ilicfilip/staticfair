# Requirements

This file is the explicit capability and coverage contract for the fair.pm static site migration.

## Active

### R001 — Static page migration
- Class: core-capability
- Status: active
- Description: All 18 static pages render with correct content, preserved URLs, and semantic HTML
- Why it matters: Content parity is the baseline — any missing or broken page is a regression from the WordPress site
- Source: user
- Primary owning slice: M001/S03
- Supporting slices: M001/S01, M001/S04
- Validation: validated — S03 confirmed all 18 pages (1 homepage + 15 static + 2 WP-only) render at preserved URLs. Build produces all expected paths. Content parity spot-checked against live WP for 3 key pages (about, what-is-fair, governance).
- Notes: Content sources split between fairpm/website-content repo and live WordPress. Pages: homepage, 4 about, 7 governance, 2 get-involved, 1 knowledge base, 1 rethinking-wordpress-distribution

### R002 — Blog content collection
- Class: core-capability
- Status: active
- Description: 9 blog posts managed as typed Markdown content collection with Zod-validated schema, listing page, and individual post pages
- Why it matters: Blog is the primary dynamic content type — schema validation prevents silent breakage when adding new posts
- Source: user
- Primary owning slice: M001/S03
- Supporting slices: M001/S01
- Validation: validated — S03 migrated all 9 posts with Zod-valid frontmatter (title, description, pubDate, author, tags, image). Blog listing shows 9 posts sorted by date. Dynamic route generates individual pages. Build-time schema validation catches mismatched fields.
- Notes: Posts extracted from WordPress REST API. Schema enforces title, date, description, author, tags, image

### R003 — RSS feed
- Class: core-capability
- Status: active
- Description: Valid RSS 2.0 feed at /rss.xml generated from the blog content collection
- Why it matters: Existing feed at /feed/ has subscribers; must preserve with redirect
- Source: inferred
- Primary owning slice: M001/S03
- Supporting slices: none
- Validation: validated — S03 confirmed RSS at /rss.xml with valid `<rss version="2.0">` root, 9 `<item>` elements with title/link/description/pubDate. /feed/ → /rss.xml redirect deferred to S05.
- Notes: /feed/ redirects to /rss.xml via _redirects

### R004 — SEO completeness
- Class: quality-attribute
- Status: active
- Description: Every page has: unique meta description (120-160 chars), canonical URL, OG tags, Twitter Card tags, and appropriate JSON-LD structured data
- Why it matters: Current site is missing meta descriptions, Twitter Cards, canonical URLs, robots.txt, and sitemap — this is the primary SEO improvement opportunity
- Source: research
- Primary owning slice: M001/S04
- Supporting slices: M001/S01
- Validation: validated — S04 confirmed all 26 pages have JSON-LD structured data (WebSite+Organization on homepage, BlogPosting+BreadcrumbList on blog posts, WebPage+BreadcrumbList on static pages), unique meta descriptions ≤160 chars, canonical URLs, OG tags (including og:site_name, og:locale, og:image), and Twitter Card tags. 14 automated checks pass. JSON-LD structural validity confirmed via parsing on 3 sample pages.
- Notes: Structured data types: WebSite (homepage), Organization, BlogPosting, BreadcrumbList, WebPage. Drop SearchAction unless Pagefind is added later

### R005 — Sitemap
- Class: quality-attribute
- Status: active
- Description: Auto-generated sitemap at /sitemap-index.xml via @astrojs/sitemap, excluding /packages/* paths
- Why it matters: Current site has no sitemap (404). This is a critical SEO fix
- Source: research
- Primary owning slice: M001/S04
- Supporting slices: none
- Validation: validated — S04 confirmed sitemap-0.xml contains exactly 26 URLs matching all built pages. No /packages/* entries present. Sitemap linked from every page via `<link rel="sitemap" href="/sitemap-index.xml">`.
- Notes: Configure site: 'https://fair.pm' in astro.config.mjs

### R006 — URL preservation
- Class: core-capability
- Status: active
- Description: All existing non-packages URLs either preserved at their current path or 301-redirected. Includes: 9 blog post URL rewrites (drop date segments), WordPress infrastructure URLs (/wp-admin/*, /wp-login.php, /wp-content/*, /wp-json/*, /xmlrpc.php → /), and /feed/ → /rss.xml
- Why it matters: Broken URLs cause SEO ranking loss and broken bookmarks/links from external sites
- Source: user
- Primary owning slice: M001/S05
- Supporting slices: none
- Validation: validated — S05 confirmed `_redirects` contains 15 rules (all 301): 9 blog URL rewrites (date-segmented → clean), /feed/ → /rss.xml, /wp-login.php → /, /xmlrpc.php → /, /wp-admin/*, /wp-content/*, /wp-json/* → /. Static rules ordered before dynamic. All verified in build output.
- Notes: /packages/* URLs are excluded — they are handled by the standalone WP install. Static page URLs are preserved as-is (no redirects needed). Only blog posts change URL structure. Runtime verification requires curl against deployed site.

### R007 — Accessibility (WCAG AA)
- Class: quality-attribute
- Status: active
- Description: Site meets WCAG AA: skip-to-content links, color contrast ratios (4.5:1 normal, 3:1 large), visible focus indicators, keyboard navigation, ARIA landmarks, screen reader compatibility
- Why it matters: Accessibility is a first-class concern per user requirement, and the design refresh is an opportunity to fix the current theme's contrast issues (green #25b372 fails AA on white)
- Source: user
- Primary owning slice: M001/S02
- Supporting slices: M001/S01, M001/S04
- Validation: partial — S02 validated on homepage: Lighthouse 100%, keyboard nav complete, focus indicators verified, ARIA landmarks present, skip-to-content functional, prefers-reduced-motion respected. S04 fixed heading hierarchy across all blog posts and static pages (no content h1 tags, no level skips). VoiceOver testing recommended but not blocking.
- Notes: Test with Lighthouse accessibility audit, axe-core, and VoiceOver on key pages

### R008 — Image optimization
- Class: quality-attribute
- Status: active
- Description: All images served through Astro's Image component with automatic WebP/AVIF conversion, responsive srcset, width/height attributes, lazy loading, and required alt text
- Why it matters: Images are the biggest performance bottleneck on the current site. Astro's Image component prevents CLS and reduces payload
- Source: research
- Primary owning slice: M001/S03
- Supporting slices: none
- Validation: validated — S03 confirmed 5 blog images optimized to WebP in dist/_astro/. Blog HTML references /_astro/*.webp paths with responsive srcset. Images referenced via Markdown syntax flow through Astro's optimization pipeline.
- Notes: Blog post images extracted from WordPress. Static page images from fairpm/website-content repo assets/

### R009 — Responsive design
- Class: quality-attribute
- Status: active
- Description: Site works correctly across mobile (320px+), tablet (768px+), and desktop (1024px+) viewports
- Why it matters: Significant portion of traffic is mobile. Current WP theme handles this; migration must not regress
- Source: inferred
- Primary owning slice: M001/S02
- Supporting slices: M001/S03
- Validation: partial — S02 validated homepage responsive layout at 375px, 768px, 1280px. Header hamburger/desktop nav transition at 1024px verified. No horizontal overflow. Content page responsive behavior deferred to S03.
- Notes: Tailwind breakpoints handle this naturally. Test header/nav, content layout, images

### R010 — Cloudflare Pages deployment
- Class: operability
- Status: active
- Description: CI/CD pipeline via GitHub Actions, auto-deploy on push to main, staging environment on *.pages.dev with X-Robots-Tag: noindex, step-by-step Cloudflare setup instructions included
- Why it matters: User needs full Cloudflare configuration guidance including DNS, Pages project, and routing rules
- Source: user
- Primary owning slice: M001/S05
- Supporting slices: none
- Validation: validated — S05 created `.github/workflows/deploy.yml` (triggers on push to main, uses cloudflare/wrangler-action@v3, handles src-astro/ subdirectory), `_headers` with X-Robots-Tag noindex for *.pages.dev staging and cache strategy, and `docs/cloudflare-setup.md` with 9-section setup guide covering Pages project, DNS, secrets, and /packages/* routing. YAML syntax validated. All artifacts verified in build output.
- Notes: Includes _headers file for cache strategy and staging noindex. Instructions cover: Pages project creation, custom domain, DNS config. Workflow untested against GitHub Actions — requires pushing to GitHub with configured secrets.

### R011 — /packages/* routing
- Class: integration
- Status: active
- Description: /packages/* requests route to a separate WordPress origin via Cloudflare origin routing rules, transparent to user (URL stays on fair.pm)
- Why it matters: The package explorer is a standalone WP install; the static site must coexist with it under the same domain
- Source: user
- Primary owning slice: M001/S05
- Supporting slices: none
- Validation: partial — S05 documented Origin Rules configuration in `docs/cloudflare-setup.md` section 7, with exact dashboard steps and curl verification commands. Cannot be fully validated until both the Astro site and WP origin are live on Cloudflare. The configuration approach (Origin Rules overriding Host header for /packages/* paths) is correct per Cloudflare docs.
- Notes: Cloudflare Origin Rules route needed. Step-by-step instructions included in deployment docs. Requires WP origin to be accessible before runtime verification is possible.

### R012 — Design refresh
- Class: differentiator
- Status: active
- Description: Light visual refresh using existing brand color palette (with contrast fixes), Mona Sans font, Tailwind CSS, modernized typography and spacing. Not a full redesign — preserve brand identity
- Why it matters: Opportunity to modernize while migrating, with accessibility improvements baked in
- Source: user
- Primary owning slice: M001/S02
- Supporting slices: M001/S01
- Validation: validated — S02 delivered full visual refresh: styled header (blue bar, responsive nav), footer (dark-blue bg), homepage sections (hero, cards, features, CTA), typography system, and AA-compliant color tokens. All verified in browser.
- Notes: Key contrast fix: green #25b372 on white is 3.2:1 (fails AA). Adjusted to #1a7f53 (4.99:1, passes AA). Design tokens carried forward from current theme

### R013 — Placeholder branding
- Class: launchability
- Status: active
- Description: Clean text-based FAIR wordmark and generated favicon, designed as placeholders for easy replacement when final branding is decided
- Why it matters: Site needs a logo and favicon to launch, but real branding hasn't been decided yet
- Source: user
- Primary owning slice: M001/S02
- Supporting slices: none
- Validation: validated — S02 created logo.svg (FAIR text wordmark), favicon.svg (F on blue bg), favicon.ico (32×32). All wired into header and BaseLayout head. Render confirmed in browser.
- Notes: Placeholders use <text> element (logo) and simple pixel art (favicon). Replace with path-based SVG when final branding is decided (R017)

### R014 — robots.txt
- Class: quality-attribute
- Status: active
- Description: robots.txt present at site root with sitemap reference, all crawlers including AI crawlers allowed
- Why it matters: Current site returns 404 for robots.txt. Fixing this improves discoverability
- Source: research
- Primary owning slice: M001/S05
- Supporting slices: none
- Validation: validated — S05 created `public/robots.txt` with `User-agent: *`, `Allow: /`, and `Sitemap: https://fair.pm/sitemap-index.xml`. Verified present in dist/ after build.
- Notes: Static file in public/robots.txt

## Deferred

### R015 — Site search (Pagefind)
- Class: core-capability
- Status: deferred
- Description: Client-side search across all pages using Pagefind or similar static search library
- Why it matters: Current site has SearchAction schema but limited search utility. Would improve UX for larger content sets
- Source: research
- Primary owning slice: none
- Supporting slices: none
- Validation: unmapped
- Notes: Deferred until post-launch demand warrants it. If added, re-enable SearchAction in structured data

### R016 — Headless CMS integration
- Class: operability
- Status: deferred
- Description: Integration with a headless CMS (Tina, Decap) for non-technical content editors
- Why it matters: Currently all content editing requires GitHub PR workflow. If non-technical editors join, they'll need a CMS
- Source: inferred
- Primary owning slice: none
- Supporting slices: none
- Validation: unmapped
- Notes: Deferred — content managed via GitHub PRs for now. Content structure abstracted enough to add CMS layer later

### R017 — Final branding
- Class: differentiator
- Status: deferred
- Description: Professional logo, favicon, and brand guidelines replacing the placeholder assets
- Why it matters: Brand identity is important for a Linux Foundation project's credibility
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: unmapped
- Notes: Branding decisions haven't been made yet. When ready, update site logo, favicon, and any brand-colored elements

### R018 — Multilingual / i18n
- Class: core-capability
- Status: deferred
- Description: Multi-language support for site content
- Why it matters: FAIR is a global project; translated content could expand reach
- Source: inferred
- Primary owning slice: none
- Supporting slices: none
- Validation: unmapped
- Notes: Astro has built-in i18n routing. Deferred until there's demand and translated content

## Out of Scope

### R019 — Package explorer
- Class: constraint
- Status: out-of-scope
- Description: The /packages/* section (plugin/theme browsing, search, pagination) is excluded from this migration
- Why it matters: Prevents scope creep — the package explorer is the most complex piece and will be served by a standalone WP install
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: n/a
- Notes: Nav links to /packages/ which routes to separate WP origin

### R020 — User accounts / comments / e-commerce
- Class: anti-feature
- Status: out-of-scope
- Description: No user accounts, comments, or e-commerce features
- Why it matters: These don't exist on the current site and aren't needed
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: n/a
- Notes: Pure static content site

### R021 — SSR / server-rendered routes
- Class: constraint
- Status: out-of-scope
- Description: No server-side rendering — pure static output only
- Why it matters: SSR would add complexity (Cloudflare adapter, Workers) without clear benefit now that packages are excluded
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: n/a
- Notes: Can be revisited if a future feature (e.g., search API) requires it

## Traceability

| ID | Class | Status | Primary owner | Supporting | Proof |
|---|---|---|---|---|---|
| R001 | core-capability | active | M001/S03 | M001/S01, M001/S04 | validated (S03: 18 pages at preserved URLs, content parity spot-checked) |
| R002 | core-capability | active | M001/S03 | M001/S01 | validated (S03: 9 posts, Zod schema, listing, dynamic route) |
| R003 | core-capability | active | M001/S03 | none | validated (S03: RSS 2.0 with 9 items, valid structure) |
| R004 | quality-attribute | active | M001/S04 | M001/S01 | validated (S04: JSON-LD on 26 pages, meta descriptions ≤160, OG/Twitter/canonical on all pages) |
| R005 | quality-attribute | active | M001/S04 | none | validated (S04: 26 URLs in sitemap, no /packages/*, linked from every page) |
| R006 | core-capability | active | M001/S05 | none | validated (S05: 15 redirect rules in _redirects, all 301, static before dynamic) |
| R007 | quality-attribute | active | M001/S02 | M001/S01, M001/S04 | partial (S02: homepage Lighthouse 100%, keyboard nav, focus, ARIA, skip-link; S04: heading hierarchy fixed site-wide) |
| R008 | quality-attribute | active | M001/S03 | none | validated (S03: 5 images → WebP, responsive srcset) |
| R009 | quality-attribute | active | M001/S02 | M001/S03 | partial (S02: homepage responsive at 375/768/1280px) |
| R010 | operability | active | M001/S05 | none | validated (S05: deploy.yml + _headers noindex + docs/cloudflare-setup.md) |
| R011 | integration | active | M001/S05 | none | partial (S05: Origin Rules documented with curl verification; runtime test requires live WP origin) |
| R012 | differentiator | active | M001/S02 | M001/S01 | validated (S02: full visual refresh verified) |
| R013 | launchability | active | M001/S02 | none | validated (S02: logo + favicon created and wired) |
| R014 | quality-attribute | active | M001/S05 | none | validated (S05: robots.txt with sitemap reference in dist/) |
| R015 | core-capability | deferred | none | none | unmapped |
| R016 | operability | deferred | none | none | unmapped |
| R017 | differentiator | deferred | none | none | unmapped |
| R018 | core-capability | deferred | none | none | unmapped |
| R019 | constraint | out-of-scope | none | none | n/a |
| R020 | anti-feature | out-of-scope | none | none | n/a |
| R021 | constraint | out-of-scope | none | none | n/a |

## Coverage Summary

- Active requirements: 14
- Mapped to slices: 14
- Validated: 11 (R001, R002, R003, R004, R005, R006, R008, R010, R012, R013, R014)
- Partially validated: 3 (R007, R009, R011)
- Unmapped active requirements: 0
