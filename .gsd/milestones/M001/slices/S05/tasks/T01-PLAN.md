---
estimated_steps: 5
estimated_files: 3
---

# T01: Create _redirects, _headers, and robots.txt

**Slice:** S05 — Deployment & Redirects
**Milestone:** M001

## Description

Create the three static deployment configuration files that Cloudflare Pages consumes at runtime. `_redirects` preserves SEO equity by 301-redirecting all old WordPress blog URLs (date-segmented) to clean Astro URLs, redirects /feed/ to /rss.xml, and sends WP infrastructure URLs to /. `_headers` protects staging deployments from indexing and optimizes caching. `robots.txt` enables search engine discovery via sitemap reference.

## Steps

1. Create `src-astro/public/_redirects` with all redirect rules in correct order:
   - **Static redirects first** (11 rules):
     - 9 blog URL rewrites: `/blog/YYYY/MM/DD/slug/` → `/blog/slug/` (all 301)
     - 1 feed redirect: `/feed/` → `/rss.xml` (301)
     - 1 WP login: `/wp-login.php` → `/` (301)
     - 1 xmlrpc: `/xmlrpc.php` → `/` (301)
   - **Dynamic (wildcard) redirects after** (3 rules):
     - `/wp-admin/*` → `/` (301)
     - `/wp-content/*` → `/` (301)
     - `/wp-json/*` → `/` (301)
   - Ensure trailing slashes on blog targets (Astro generates `/blog/slug/index.html`)
   - Use Cloudflare format: `source destination statusCode` (space-separated, one per line)

2. Create `src-astro/public/_headers` with three sections:
   - Staging noindex: `https://:project.pages.dev/*` and `https://:version.:project.pages.dev/*` with `X-Robots-Tag: noindex`
   - Hashed asset caching: `/_astro/*` with `Cache-Control: public, max-age=31536000, immutable`
   - HTML caching: `/*` with `Cache-Control: public, max-age=0, must-revalidate` (or short TTL)
   - Order matters: more specific paths before wildcard `/*`

3. Create `src-astro/public/robots.txt`:
   - `User-agent: *`
   - `Allow: /`
   - `Sitemap: https://fair.pm/sitemap-index.xml`

4. Run `cd src-astro && npm run build` and verify all three files appear in `dist/` root.

5. Validate content:
   - Count 301 occurrences in _redirects (expect 15)
   - Confirm static rules appear before dynamic rules (by line number)
   - Confirm X-Robots-Tag in _headers
   - Confirm immutable caching in _headers
   - Confirm full sitemap URL in robots.txt

## Must-Haves

- [ ] `_redirects` has exactly 15 rules, all 301 status
- [ ] Static redirects (11) appear before dynamic/wildcard redirects (3)
- [ ] All 9 blog redirect sources match the exact WP date-segmented URLs from research
- [ ] All 9 blog redirect targets use trailing slashes (e.g., `/blog/slug/`)
- [ ] `/feed/` → `/rss.xml` redirect present
- [ ] `/wp-login.php` and `/xmlrpc.php` static redirects present
- [ ] `/wp-admin/*`, `/wp-content/*`, `/wp-json/*` wildcard redirects present
- [ ] `_headers` has staging noindex for both `:project.pages.dev` and `:version.:project.pages.dev`
- [ ] `_headers` has immutable caching for `/_astro/*`
- [ ] `robots.txt` references `https://fair.pm/sitemap-index.xml`
- [ ] All three files present in `dist/` after build

## Verification

- `npm run build` exits 0 with 26 pages
- `test -f dist/_redirects && test -f dist/_headers && test -f dist/robots.txt` — all three files in dist
- `grep -c '301' dist/_redirects` = 15
- `grep '/blog/2025/08/20/fair-plugin-version-0-4-0-decentralized-installation/' dist/_redirects` — first blog redirect present
- `grep '/blog/2026/02/26/second-star-to-the-right-and-straight-on-till-morning/' dist/_redirects` — last blog redirect present
- `grep '/feed/' dist/_redirects | grep '/rss.xml'` — feed redirect
- `grep '/wp-admin/\*' dist/_redirects` — WP wildcard present
- Static rules appear before line containing first `*` wildcard
- `grep 'X-Robots-Tag' dist/_headers` — staging noindex
- `grep 'immutable' dist/_headers` — asset caching
- `grep 'https://fair.pm/sitemap-index.xml' dist/robots.txt` — sitemap reference

## Observability Impact

- Signals added/changed: None — static config files consumed by Cloudflare at runtime
- How a future agent inspects this: `cat dist/_redirects`, `cat dist/_headers`, `cat dist/robots.txt` after any build
- Failure state exposed: Malformed rules silently ignored by Cloudflare — only detectable via curl testing against deployed site. Locally, file presence and content correctness are the only inspectable signals.

## Inputs

- S05-RESEARCH.md redirect map (complete list of 15 rules with exact source/target URLs)
- S05-RESEARCH.md constraints on Cloudflare _redirects format (static before dynamic, single * per rule, :splat syntax)
- S05-RESEARCH.md pitfalls on _headers path matching and staging noindex format
- Blog post slugs in `src-astro/src/content/blog/*.md` (9 files — slug = filename without .md)
- `src-astro/src/utils/structured-data.ts` — SITE_URL constant ('https://fair.pm') for reference

## Expected Output

- `src-astro/public/_redirects` — 15 redirect rules in correct Cloudflare format, static before dynamic
- `src-astro/public/_headers` — staging noindex + cache strategy headers
- `src-astro/public/robots.txt` — crawler config with sitemap reference
- All three files verified present in `dist/` after build
