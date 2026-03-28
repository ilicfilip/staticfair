---
id: T01
parent: S05
milestone: M001
provides:
  - _redirects with 15 Cloudflare Pages redirect rules (SEO equity preservation)
  - _headers with staging noindex and cache strategy
  - robots.txt with sitemap reference
key_files:
  - src-astro/public/_redirects
  - src-astro/public/_headers
  - src-astro/public/robots.txt
key_decisions: []
patterns_established:
  - Cloudflare Pages static config files live in src-astro/public/ and are copied to dist/ by Astro build
observability_surfaces:
  - "cat dist/_redirects after build to inspect redirect rules"
  - "cat dist/_headers after build to inspect header config"
  - "cat dist/robots.txt after build to inspect crawler config"
duration: 8m
verification_result: passed
completed_at: 2026-03-27
blocker_discovered: false
---

# T01: Create _redirects, _headers, and robots.txt

**Created three Cloudflare Pages static config files: 15 redirect rules preserving SEO equity from WP URLs, staging noindex + cache headers, and robots.txt with sitemap reference.**

## What Happened

Created all three files in `src-astro/public/`:

1. **`_redirects`** — 15 rules total, all 301:
   - 9 blog URL rewrites: WP date-segmented `/blog/YYYY/MM/DD/slug/` → clean `/blog/slug/` (all with trailing slashes)
   - 1 feed redirect: `/feed/` → `/rss.xml`
   - 2 static WP infrastructure: `/wp-login.php` → `/`, `/xmlrpc.php` → `/`
   - 3 dynamic wildcard WP infrastructure: `/wp-admin/*`, `/wp-content/*`, `/wp-json/*` → `/`
   - Static rules placed before dynamic rules per Cloudflare requirements

2. **`_headers`** — Three sections in correct specificity order:
   - Staging noindex for `https://:project.pages.dev/*` and `https://:version.:project.pages.dev/*`
   - Immutable caching for `/_astro/*` (content-hashed assets)
   - Must-revalidate for `/*` (HTML and other content)

3. **`robots.txt`** — Allow all crawlers, sitemap at `https://fair.pm/sitemap-index.xml`

Build confirmed all three files land in `dist/` root.

## Verification

All checks passed:

- V1: ✅ `_redirects` exists in dist/
- V2: ✅ `grep -c '301' dist/_redirects` = 15
- V3: ✅ First blog redirect present (fair-plugin-version-0-4-0)
- V4: ✅ Feed redirect `/feed/` → `/rss.xml` present
- V5: ✅ WP admin wildcard `/wp-admin/*` present
- V6: ✅ Static rules (line 2) before dynamic/wildcard rules (line 20)
- V7: ✅ `_headers` exists in dist/
- V8: ✅ X-Robots-Tag noindex present (both staging patterns)
- V9: ✅ Immutable caching present for `/_astro/*`
- V10: ✅ robots.txt exists in dist/
- V11: ✅ Sitemap reference `https://fair.pm/sitemap-index.xml` present
- V17: ✅ `npm run build` exits 0 with 26 pages

Additional checks:
- ✅ Last blog redirect present (second-star-to-the-right)
- ✅ `/wp-login.php` and `/xmlrpc.php` static redirects present
- ✅ `/wp-content/*` and `/wp-json/*` wildcards present
- ✅ All 9 blog redirect targets have trailing slashes

Slice V12–V16 not yet applicable (T02/T03 scope).

## Diagnostics

Static config files — no runtime diagnostics. After build, inspect with:
- `cat dist/_redirects` — verify redirect rules and ordering
- `cat dist/_headers` — verify header rules
- `cat dist/robots.txt` — verify crawler config

Malformed rules are silently ignored by Cloudflare at runtime — only detectable via curl against deployed site.

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `src-astro/public/_redirects` — 15 Cloudflare Pages redirect rules (11 static + 4 dynamic, all 301)
- `src-astro/public/_headers` — Staging noindex + immutable asset caching + HTML must-revalidate
- `src-astro/public/robots.txt` — Crawler config with sitemap reference
