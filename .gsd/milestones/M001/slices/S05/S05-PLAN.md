# S05: Deployment & Redirects

**Goal:** Site is deploy-ready for Cloudflare Pages with all redirects, cache headers, robots.txt, CI/CD pipeline, and setup documentation complete.
**Demo:** `npm run build` produces a `dist/` with `_redirects` (15 rules), `_headers` (staging noindex + cache strategy), and `robots.txt`. GitHub Actions workflow exists at repo root. Step-by-step Cloudflare setup guide covers Pages project, DNS, /packages/* routing. All redirect rules verified for format correctness. Staging noindex header configured.

## Must-Haves

- `public/_redirects` with 9 static blog URL redirects (date-segmented → clean), 1 static /feed/ → /rss.xml, 1 static /wp-login.php → /, 1 static /xmlrpc.php → /, 3 dynamic WP wildcard redirects (/wp-admin/*, /wp-content/*, /wp-json/*). All 301. Static rules before dynamic.
- `public/_headers` with X-Robots-Tag noindex on *.pages.dev (staging), immutable caching on `/_astro/*`, moderate caching on HTML
- `public/robots.txt` with User-agent: *, Allow: /, Sitemap: https://fair.pm/sitemap-index.xml
- `.github/workflows/deploy.yml` at repo root with checkout, node setup, npm ci + build in src-astro/, deploy via cloudflare/wrangler-action@v3
- `docs/cloudflare-setup.md` at repo root with step-by-step instructions for Pages project creation, custom domain, DNS, /packages/* Origin Rules routing, secret configuration
- All 15 redirect rules use correct Cloudflare Pages `_redirects` syntax
- All redirect targets include trailing slashes where appropriate
- Build output contains all three public/ files in dist/ root

## Proof Level

- This slice proves: final-assembly (all static deployment artifacts are correct-by-construction; CI workflow is syntactically valid)
- Real runtime required: no (actual Cloudflare deployment requires pushing to GitHub and configuring secrets — documented but not exercisable locally)
- Human/UAT required: yes (Cloudflare dashboard configuration for Origin Rules, DNS, and secret setup must be done manually per docs)

## Verification

All checks run against `cd src-astro && npm run build` output:

- V1: `test -f dist/_redirects` — _redirects file exists in build output
- V2: `grep -c '301' dist/_redirects` = 15 (all rules are 301)
- V3: `grep '/blog/2025/08/20/fair-plugin-version-0-4-0-decentralized-installation/' dist/_redirects` — first blog redirect present with correct target
- V4: `grep '/feed/' dist/_redirects | grep '/rss.xml'` — feed redirect present
- V5: `grep '/wp-admin/\*' dist/_redirects` — WP admin wildcard redirect present
- V6: Static redirects appear before dynamic (wildcard) redirects in _redirects — verified by line number comparison
- V7: `test -f dist/_headers` — _headers file exists in build output
- V8: `grep 'X-Robots-Tag' dist/_headers` — staging noindex header present
- V9: `grep 'immutable' dist/_headers` — immutable caching for /_astro/* present
- V10: `test -f dist/robots.txt` — robots.txt exists in build output
- V11: `grep 'sitemap-index.xml' dist/robots.txt` — sitemap reference present with full absolute URL
- V12: `test -f .github/workflows/deploy.yml` (at repo root) — CI workflow exists
- V13: `grep 'wrangler-action' .github/workflows/deploy.yml` — uses correct Cloudflare action
- V14: `grep 'branches.*main' .github/workflows/deploy.yml` — scoped to main branch
- V15: `test -f docs/cloudflare-setup.md` (at repo root) — setup documentation exists
- V16: `grep -i 'origin.rule\|packages' docs/cloudflare-setup.md` — /packages/* routing instructions present
- V17: `npm run build` exits 0 with 26 pages — no regressions

## Observability / Diagnostics

- Runtime signals: None — all artifacts are static files. Build exit code is the primary health signal.
- Inspection surfaces: `cat dist/_redirects` to inspect redirect rules; `cat dist/_headers` to inspect header rules; `cat dist/robots.txt` to inspect crawler config. GitHub Actions logs (once deployed) show deploy status.
- Failure visibility: `npm run build` exit code — 0 = healthy. Malformed `_redirects` or `_headers` won't cause build failure but will cause runtime redirect/header failures on Cloudflare Pages (only detectable after deploy via curl).
- Redaction constraints: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are GitHub-side secrets — never stored locally. Documentation references them by name only.

## Integration Closure

- Upstream surfaces consumed: `src-astro/astro.config.mjs` (site URL, build config), `src-astro/src/utils/structured-data.ts` (SITE_URL constant for reference), all 26 pages from S01–S04, `package-lock.json`
- New wiring introduced in this slice: `public/_redirects` → copied to `dist/` by Astro build → consumed by Cloudflare Pages at runtime. `public/_headers` → same path. `public/robots.txt` → same path. `.github/workflows/deploy.yml` → consumed by GitHub Actions on push to main. `docs/cloudflare-setup.md` → human-consumed documentation.
- What remains before the milestone is truly usable end-to-end: Push repo to GitHub, configure `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as GitHub secrets, create Cloudflare Pages project, configure custom domain DNS, set up /packages/* Origin Rules in Cloudflare dashboard (requires WP origin to be live). All documented in cloudflare-setup.md.

## Tasks

- [x] **T01: Create _redirects, _headers, and robots.txt** `est:20m`
  - Why: These three static files are the core deployment artifacts — redirects preserve SEO equity from old URLs, headers protect staging from indexing and optimize caching, robots.txt enables crawler discovery. Covers R006, R010 (partial), R014.
  - Files: `src-astro/public/_redirects`, `src-astro/public/_headers`, `src-astro/public/robots.txt`
  - Do: Create `_redirects` with 11 static rules first (9 blog URL rewrites, /feed/ → /rss.xml, /wp-login.php → /, /xmlrpc.php → /), then 3 dynamic wildcard rules (/wp-admin/*, /wp-content/*, /wp-json/*). All 301. Create `_headers` with staging noindex (https://:project.pages.dev/* and https://:version.:project.pages.dev/*), immutable caching for /_astro/*, short cache for HTML. Create `robots.txt` with full sitemap URL. Run build and verify all files land in dist/.
  - Verify: `npm run build` exits 0; V1–V11 all pass (files exist, correct content, static before dynamic ordering)
  - Done when: All three files exist in dist/ after build with correct content and formatting

- [x] **T02: Create GitHub Actions deploy workflow** `est:15m`
  - Why: Automates deployment to Cloudflare Pages on push to main. Covers R010.
  - Files: `.github/workflows/deploy.yml` (at repo root)
  - Do: Create workflow triggered on push to main branch. Steps: checkout, setup node (LTS), `npm ci` and `npm run build` with working-directory src-astro/, deploy via cloudflare/wrangler-action@v3 with `pages deploy src-astro/dist` and required secrets (CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID). Use `workingDirectory` (camelCase) for the wrangler action, `working-directory` (kebab-case) for native run steps.
  - Verify: V12–V14 pass (file exists, uses wrangler-action, scoped to main branch); YAML is syntactically valid
  - Done when: `.github/workflows/deploy.yml` exists at repo root with correct structure and references

- [x] **T03: Write Cloudflare setup documentation and run full verification** `est:20m`
  - Why: Step-by-step guide for configuring Cloudflare Pages, DNS, and /packages/* routing — the human-executed counterpart to the automated deploy pipeline. Also runs the final verification pass to confirm everything works together. Covers R010 (docs), R011.
  - Files: `docs/cloudflare-setup.md` (at repo root)
  - Do: Write comprehensive setup guide covering: 1) Create Cloudflare Pages project, 2) Connect GitHub repo, 3) Configure build settings (src-astro/ base dir, npm run build, dist/ output), 4) Set up custom domain (fair.pm), 5) DNS configuration, 6) Configure /packages/* routing via Origin Rules (with note that WP origin must be live), 7) GitHub secrets setup (CLOUDFLARE_API_TOKEN permissions, CLOUDFLARE_ACCOUNT_ID), 8) Verify staging noindex, 9) Verify redirects with curl examples, 10) Verify /packages/* routing. Run full V1–V17 verification sweep.
  - Verify: V15–V17 pass; all 17 verification checks pass end-to-end
  - Done when: All 17 verification checks pass, docs/cloudflare-setup.md is complete with actionable instructions

## Files Likely Touched

- `src-astro/public/_redirects`
- `src-astro/public/_headers`
- `src-astro/public/robots.txt`
- `.github/workflows/deploy.yml`
- `docs/cloudflare-setup.md`
