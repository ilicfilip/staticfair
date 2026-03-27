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
- Validation: unmapped
- Notes: Content sources split between fairpm/website-content repo and live WordPress. Pages: homepage, 4 about, 7 governance, 2 get-involved, 1 knowledge base, 1 rethinking-wordpress-distribution

### R002 — Blog content collection
- Class: core-capability
- Status: active
- Description: 9 blog posts managed as typed Markdown content collection with Zod-validated schema, listing page, and individual post pages
- Why it matters: Blog is the primary dynamic content type — schema validation prevents silent breakage when adding new posts
- Source: user
- Primary owning slice: M001/S03
- Supporting slices: M001/S01
- Validation: unmapped
- Notes: Posts extracted from WordPress REST API. Schema enforces title, date, description, author, tags, image

### R003 — RSS feed
- Class: core-capability
- Status: active
- Description: Valid RSS 2.0 feed at /rss.xml generated from the blog content collection
- Why it matters: Existing feed at /feed/ has subscribers; must preserve with redirect
- Source: inferred
- Primary owning slice: M001/S03
- Supporting slices: none
- Validation: unmapped
- Notes: /feed/ redirects to /rss.xml via _redirects

### R004 — SEO completeness
- Class: quality-attribute
- Status: active
- Description: Every page has: unique meta description (120-160 chars), canonical URL, OG tags, Twitter Card tags, and appropriate JSON-LD structured data
- Why it matters: Current site is missing meta descriptions, Twitter Cards, canonical URLs, robots.txt, and sitemap — this is the primary SEO improvement opportunity
- Source: research
- Primary owning slice: M001/S04
- Supporting slices: M001/S01
- Validation: unmapped
- Notes: Structured data types: WebSite (homepage), Organization, BlogPosting, BreadcrumbList, WebPage. Drop SearchAction unless Pagefind is added later

### R005 — Sitemap
- Class: quality-attribute
- Status: active
- Description: Auto-generated sitemap at /sitemap-index.xml via @astrojs/sitemap, excluding /packages/* paths
- Why it matters: Current site has no sitemap (404). This is a critical SEO fix
- Source: research
- Primary owning slice: M001/S04
- Supporting slices: none
- Validation: partial — sitemap-index.xml generated with /packages/* filter (S01). Full validation (all pages included) deferred to S04 after S03 adds content.
- Notes: Configure site: 'https://fair.pm' in astro.config.mjs

### R006 — URL preservation
- Class: core-capability
- Status: active
- Description: All existing non-packages URLs either preserved at their current path or 301-redirected. Includes: 9 blog post URL rewrites (drop date segments), WordPress infrastructure URLs (/wp-admin/*, /wp-login.php, /wp-content/*, /wp-json/*, /xmlrpc.php → /), and /feed/ → /rss.xml
- Why it matters: Broken URLs cause SEO ranking loss and broken bookmarks/links from external sites
- Source: user
- Primary owning slice: M001/S05
- Supporting slices: none
- Validation: unmapped
- Notes: /packages/* URLs are excluded — they are handled by the standalone WP install. Static page URLs are preserved as-is (no redirects needed). Only blog posts change URL structure

### R007 — Accessibility (WCAG AA)
- Class: quality-attribute
- Status: active
- Description: Site meets WCAG AA: skip-to-content links, color contrast ratios (4.5:1 normal, 3:1 large), visible focus indicators, keyboard navigation, ARIA landmarks, screen reader compatibility
- Why it matters: Accessibility is a first-class concern per user requirement, and the design refresh is an opportunity to fix the current theme's contrast issues (green #25b372 fails AA on white)
- Source: user
- Primary owning slice: M001/S02
- Supporting slices: M001/S01, M001/S04
- Validation: partial — S02 validated on homepage: Lighthouse 100%, keyboard nav complete, focus indicators verified, ARIA landmarks present, skip-to-content functional, prefers-reduced-motion respected. Full site-wide validation after S03 adds content pages. VoiceOver testing recommended but not blocking.
- Notes: Test with Lighthouse accessibility audit, axe-core, and VoiceOver on key pages

### R008 — Image optimization
- Class: quality-attribute
- Status: active
- Description: All images served through Astro's Image component with automatic WebP/AVIF conversion, responsive srcset, width/height attributes, lazy loading, and required alt text
- Why it matters: Images are the biggest performance bottleneck on the current site. Astro's Image component prevents CLS and reduces payload
- Source: research
- Primary owning slice: M001/S03
- Supporting slices: none
- Validation: unmapped
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
- Validation: unmapped
- Notes: Includes _headers file for cache strategy and staging noindex. Instructions cover: Pages project creation, custom domain, DNS config

### R011 — /packages/* routing
- Class: integration
- Status: active
- Description: /packages/* requests route to a separate WordPress origin via Cloudflare origin routing rules, transparent to user (URL stays on fair.pm)
- Why it matters: The package explorer is a standalone WP install; the static site must coexist with it under the same domain
- Source: user
- Primary owning slice: M001/S05
- Supporting slices: none
- Validation: unmapped
- Notes: Cloudflare Origin Rules or Workers route needed. Step-by-step instructions included in deployment docs. Cannot be fully verified until both origins are live

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
- Validation: unmapped
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
| R001 | core-capability | active | M001/S03 | M001/S01, M001/S04 | unmapped |
| R002 | core-capability | active | M001/S03 | M001/S01 | unmapped |
| R003 | core-capability | active | M001/S03 | none | unmapped |
| R004 | quality-attribute | active | M001/S04 | M001/S01 | unmapped |
| R005 | quality-attribute | active | M001/S04 | none | partial (S01: generation + filter verified) |
| R006 | core-capability | active | M001/S05 | none | unmapped |
| R007 | quality-attribute | active | M001/S02 | M001/S01, M001/S04 | partial (S02: homepage Lighthouse 100%, keyboard nav, focus, ARIA, skip-link) |
| R008 | quality-attribute | active | M001/S03 | none | unmapped |
| R009 | quality-attribute | active | M001/S02 | M001/S03 | partial (S02: homepage responsive at 375/768/1280px) |
| R010 | operability | active | M001/S05 | none | unmapped |
| R011 | integration | active | M001/S05 | none | unmapped |
| R012 | differentiator | active | M001/S02 | M001/S01 | validated (S02: full visual refresh verified) |
| R013 | launchability | active | M001/S02 | none | validated (S02: logo + favicon created and wired) |
| R014 | quality-attribute | active | M001/S05 | none | unmapped |
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
- Validated: 2 (R012, R013)
- Partially validated: 3 (R005, R007, R009)
- Unmapped active requirements: 0
