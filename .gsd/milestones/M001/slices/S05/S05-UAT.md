# S05: Deployment & Redirects — UAT

**Milestone:** M001
**Written:** 2026-03-27

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: All S05 deliverables are static files (redirects, headers, robots.txt, workflow YAML, documentation). Correctness is verified by inspecting build output contents and file structure. Actual Cloudflare Pages runtime behavior requires deployment, which is documented but not exercisable locally.

## Preconditions

- `cd src-astro && npm run build` exits 0 with 26 pages
- Build output exists in `src-astro/dist/`
- Repository root contains `.github/workflows/deploy.yml` and `docs/cloudflare-setup.md`

## Smoke Test

Run `cd src-astro && npm run build && test -f dist/_redirects && test -f dist/_headers && test -f dist/robots.txt && echo OK` — should print "OK".

## Test Cases

### 1. Blog URL redirects preserve SEO equity

1. Run `cat dist/_redirects | grep '/blog/2025/'`
2. Verify 9 lines appear, each mapping a date-segmented URL to a clean /blog/slug/ URL
3. **Expected:** All 9 blog URL rewrites present with 301 status and trailing slashes on targets

### 2. WordPress infrastructure URLs redirect to homepage

1. Run `grep -E 'wp-admin|wp-content|wp-json|wp-login|xmlrpc' dist/_redirects`
2. **Expected:** 5 rules present — /wp-login.php → /, /xmlrpc.php → /, /wp-admin/*, /wp-content/*, /wp-json/* all redirecting to / with 301

### 3. Feed redirect preserves RSS subscribers

1. Run `grep '/feed/' dist/_redirects`
2. **Expected:** `/feed/ /rss.xml 301` — RSS subscribers following the old /feed/ URL get redirected

### 4. Static rules ordered before dynamic rules

1. Run `grep -n '\*' dist/_redirects | head -1` to find first wildcard line
2. Run `grep -n '301$' dist/_redirects | grep -v '\*' | tail -1` to find last static rule line
3. **Expected:** Last static rule line number < first wildcard line number (Cloudflare processes in order; static must come first)

### 5. Staging noindex prevents search engine indexing of preview deploys

1. Run `cat dist/_headers`
2. **Expected:** X-Robots-Tag: noindex header configured for both `https://:project.pages.dev/*` and `https://:version.:project.pages.dev/*`

### 6. Cache strategy optimizes performance

1. Run `cat dist/_headers`
2. **Expected:** `/_astro/*` gets `Cache-Control: public, max-age=31536000, immutable` (content-hashed assets never change). `/*` gets `Cache-Control: public, max-age=0, must-revalidate` (HTML always fresh).

### 7. robots.txt enables crawler discovery

1. Run `cat dist/robots.txt`
2. **Expected:** Contains `User-agent: *`, `Allow: /`, and `Sitemap: https://fair.pm/sitemap-index.xml`

### 8. GitHub Actions workflow is correctly configured

1. Run `cat .github/workflows/deploy.yml`
2. **Expected:** Triggers on push to main only. Steps: checkout, setup-node with npm cache, npm ci + build with working-directory src-astro, deploy via cloudflare/wrangler-action@v3 with workingDirectory src-astro. References CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID secrets. Concurrency group present.

### 9. Setup documentation is comprehensive and actionable

1. Read `docs/cloudflare-setup.md`
2. **Expected:** Covers: Pages project creation, GitHub connection, build config (src-astro/ base, npm run build, dist output), secrets setup with API token permissions, custom domain, DNS, /packages/* Origin Rules, post-deploy verification curl commands, troubleshooting

## Edge Cases

### Redirect ordering with overlapping paths

1. Check that `/wp-login.php → /` (static) appears before `/wp-admin/* → /` (dynamic) in `_redirects`
2. **Expected:** Static specific rules always before wildcard rules — Cloudflare processes first match

### Missing trailing slash on blog redirect targets

1. Run `grep '/blog/' dist/_redirects | grep -v '/$'`
2. **Expected:** No output — all blog redirect targets must end with trailing slash to match Astro's trailingSlash behavior

## Failure Signals

- `npm run build` exits non-zero — build regression
- `_redirects` missing from dist/ — Astro not copying public/ files
- Redirect count ≠ 15 — missing or extra rules
- Wildcard rules before static rules — incorrect ordering may cause wrong redirects
- X-Robots-Tag missing from `_headers` — staging would get indexed by search engines
- `deploy.yml` references wrong action or missing secrets — deploy would fail silently
- `cloudflare-setup.md` missing /packages/* section — operator wouldn't know how to configure routing

## Requirements Proved By This UAT

- R006 (URL preservation) — All 15 redirect rules verified for correct syntax, targets, status codes, and ordering
- R010 (Cloudflare Pages deployment) — CI/CD workflow, staging noindex headers, and setup documentation all verified as artifacts
- R014 (robots.txt) — Present in build output with correct sitemap reference

## Not Proven By This UAT

- R010 runtime behavior — The GitHub Actions workflow has not been executed against GitHub. First real deploy will be the true test.
- R011 (/packages/* routing) — Origin Rules cannot be tested until the WordPress origin is live. Only documentation completeness is verified.
- R006 runtime behavior — Redirect rules are syntactically correct but actual 301 responses can only be verified via curl against the deployed site.
- Staging X-Robots-Tag at runtime — Header is configured in `_headers` but actual HTTP response header can only be verified after deployment.

## Notes for Tester

- All verification is against build output, not a live server. The `_redirects` and `_headers` files use Cloudflare Pages-specific syntax that has no local validation tool.
- After first deploy to Cloudflare Pages, run the curl commands in `docs/cloudflare-setup.md` section 8 to verify redirects and headers at runtime.
- The `/packages/*` Origin Rules section in the docs requires a live WordPress origin — skip that section until the WP install is ready.
- The deploy workflow YAML has been syntax-validated but not executed. First push to main with GitHub secrets configured will be the real test.
