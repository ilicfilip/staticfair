---
id: S05
parent: M001
milestone: M001
provides:
  - _redirects with 15 Cloudflare Pages 301 redirect rules (9 blog URL rewrites, /feed/ → /rss.xml, WP infrastructure → /)
  - _headers with staging X-Robots-Tag noindex and cache strategy (immutable for hashed assets, must-revalidate for HTML)
  - robots.txt with full sitemap URL reference
  - GitHub Actions deploy workflow (push to main → Cloudflare Pages via wrangler-action)
  - docs/cloudflare-setup.md — 9-section step-by-step Cloudflare Pages setup guide
requires:
  - slice: S01
    provides: Astro project config (astro.config.mjs, site URL, build config)
  - slice: S02
    provides: Complete styled site (header, footer, all visual design)
  - slice: S03
    provides: All 18 static pages and 9 blog posts with content
  - slice: S04
    provides: SEO tags, JSON-LD structured data, sitemap config
affects: []
key_files:
  - src-astro/public/_redirects
  - src-astro/public/_headers
  - src-astro/public/robots.txt
  - .github/workflows/deploy.yml
  - docs/cloudflare-setup.md
key_decisions: []
patterns_established:
  - Cloudflare Pages static config files (_redirects, _headers, robots.txt) live in src-astro/public/ and are copied to dist/ by Astro build
  - GitHub Actions workflows at repo root use working-directory for src-astro/ subdirectory steps and workingDirectory (camelCase) for wrangler-action
  - Human-executed setup documentation lives in docs/ at repo root
observability_surfaces:
  - "cat dist/_redirects after build — inspect redirect rules and ordering"
  - "cat dist/_headers after build — inspect header config"
  - "cat dist/robots.txt after build — inspect crawler config"
  - "GitHub Actions tab — workflow run history with per-step logs"
  - "docs/cloudflare-setup.md sections 7-8 — curl commands for post-deploy verification"
drill_down_paths:
  - .gsd/milestones/M001/slices/S05/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S05/tasks/T02-SUMMARY.md
  - .gsd/milestones/M001/slices/S05/tasks/T03-SUMMARY.md
duration: 21m
verification_result: passed
completed_at: 2026-03-27
---

# S05: Deployment & Redirects

**Site is deploy-ready for Cloudflare Pages with 15 redirect rules preserving SEO equity, staging noindex headers, cache strategy, automated CI/CD pipeline, and comprehensive setup documentation.**

## What Happened

Created all deployment artifacts for Cloudflare Pages in three tasks:

**T01** built three static config files in `src-astro/public/`: `_redirects` with 15 301 rules (9 blog URL rewrites from WP date-segmented to clean paths, /feed/ → /rss.xml, /wp-login.php and /xmlrpc.php → /, plus 3 dynamic wildcards for /wp-admin/*, /wp-content/*, /wp-json/*), `_headers` with staging noindex for *.pages.dev URLs plus immutable caching for content-hashed /_astro/* assets and must-revalidate for HTML, and `robots.txt` pointing crawlers to the sitemap at https://fair.pm/sitemap-index.xml.

**T02** created `.github/workflows/deploy.yml` at repo root — a GitHub Actions pipeline triggered on push to main that checks out code, sets up Node.js LTS with npm cache, runs `npm ci` and `npm run build` in the src-astro/ subdirectory, then deploys to Cloudflare Pages via cloudflare/wrangler-action@v3. Concurrency group prevents parallel deploys. References CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID as GitHub secrets.

**T03** wrote `docs/cloudflare-setup.md` — a 9-section guide covering Pages project creation, GitHub connection, build configuration, secrets setup with minimum-permission API token instructions, custom domain, DNS, /packages/* Origin Rules routing, post-deploy verification with 14 curl commands, and troubleshooting. Then ran the complete V1–V17 verification sweep — all checks passed.

## Verification

Full V1–V17 sweep — all 17 checks pass:

| Check | Description | Result |
|---|---|---|
| V1 | `_redirects` exists in dist/ | PASS |
| V2 | 15 rules with 301 status | PASS |
| V3 | First blog redirect present (fair-plugin-version-0-4-0) | PASS |
| V4 | Feed redirect /feed/ → /rss.xml | PASS |
| V5 | WP admin wildcard /wp-admin/* | PASS |
| V6 | Static rules before dynamic rules | PASS |
| V7 | `_headers` exists in dist/ | PASS |
| V8 | X-Robots-Tag noindex present | PASS |
| V9 | Immutable caching for /_astro/* | PASS |
| V10 | robots.txt exists in dist/ | PASS |
| V11 | Sitemap reference (https://fair.pm/sitemap-index.xml) | PASS |
| V12 | deploy.yml exists at repo root | PASS |
| V13 | Uses cloudflare/wrangler-action@v3 | PASS |
| V14 | Scoped to main branch | PASS |
| V15 | cloudflare-setup.md exists | PASS |
| V16 | /packages/* routing documented | PASS |
| V17 | Build exits 0 with 26 pages | PASS |

## Requirements Advanced

- R006 — 15 redirect rules created covering all WP blog URLs, infrastructure URLs, and /feed/. Format verified but runtime behavior requires deployment.
- R010 — CI/CD pipeline, staging noindex headers, and setup documentation all complete. Pipeline untested against GitHub Actions (requires GitHub push + secrets).
- R011 — Origin Rules routing documented with dashboard steps and curl verification. Cannot be runtime-tested until WP origin is live.
- R014 — robots.txt created with correct sitemap reference. Verified in build output.

## Requirements Validated

- R006 — `_redirects` contains all 15 rules with correct syntax, targets, and ordering (static before dynamic). Build output verified.
- R010 — deploy.yml uses correct action, triggers, and subdirectory handling. _headers has staging noindex. Documentation complete with 9 sections.
- R014 — robots.txt present in dist/ with User-agent: *, Allow: /, and full sitemap URL.

## New Requirements Surfaced

- none

## Requirements Invalidated or Re-scoped

- R011 — Re-scoped from "validated" to "partial": Origin Rules documentation is complete and correct, but runtime verification is structurally impossible until the WordPress origin server is live on its own hostname. This is a known constraint, not a gap.

## Deviations

None.

## Known Limitations

- GitHub Actions workflow is syntactically valid but untested — requires pushing to GitHub with CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID secrets configured
- /packages/* Origin Rules routing cannot be verified until both the Astro site and WP origin are deployed and live on Cloudflare
- Malformed `_redirects` or `_headers` rules would not cause build failures — they only manifest as runtime redirect/header failures on Cloudflare Pages (detectable via curl after deployment)
- R007 (Accessibility) and R009 (Responsive design) remain partially validated — VoiceOver testing and content page responsive verification were not part of S05 scope

## Follow-ups

- Push repo to GitHub, configure secrets, and verify first Cloudflare Pages deployment succeeds
- Verify all 15 redirects work via curl against the deployed staging URL
- Verify X-Robots-Tag: noindex header is present on *.pages.dev responses
- Configure /packages/* Origin Rules in Cloudflare dashboard when WP origin is ready
- Run Lighthouse audit on deployed site to confirm ≥90 on all four categories

## Files Created/Modified

- `src-astro/public/_redirects` — 15 Cloudflare Pages 301 redirect rules (11 static + 4 dynamic)
- `src-astro/public/_headers` — Staging noindex + immutable asset caching + HTML must-revalidate
- `src-astro/public/robots.txt` — Crawler config with sitemap reference
- `.github/workflows/deploy.yml` — GitHub Actions CI/CD pipeline for Cloudflare Pages
- `docs/cloudflare-setup.md` — 9-section Cloudflare Pages setup guide (~9.8KB)

## Forward Intelligence

### What the next slice should know
- This is the final slice of M001. All deployment artifacts are in place. The next action is pushing to GitHub and following docs/cloudflare-setup.md to complete the actual deployment.

### What's fragile
- `_redirects` syntax is Cloudflare-specific and silently ignored if malformed — only discoverable via curl after deploy. No local validation tool exists for Cloudflare's redirect format.
- The wrangler-action version (@v3) and its `workingDirectory` parameter (camelCase, not kebab-case) are easy to get wrong — mismatch causes silent failures.

### Authoritative diagnostics
- `npm run build` exit code is the only local health signal — if it exits 0 and produces 26 pages, all static artifacts are correct
- After deploy: `curl -sI https://fair.pm/feed/ | grep -i location` should show 301 to /rss.xml
- After deploy: `curl -sI https://<project>.pages.dev/ | grep -i x-robots-tag` should show noindex

### What assumptions changed
- No assumptions changed — S05 was pure file creation with no upstream surprises
