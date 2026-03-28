# S05: Deployment & Redirects — Research

**Date:** 2026-03-27

## Summary

S05 is the final assembly slice — it produces the deployment pipeline, redirect rules, robots.txt, cache headers, and documentation for Cloudflare Pages setup including /packages/* routing. The Astro project already builds cleanly with 26 pages and all content/SEO work complete from S01–S04.

The core deliverables are all static files (`_redirects`, `_headers`, `robots.txt` in `public/`) plus a GitHub Actions workflow (`.github/workflows/deploy.yml` at repo root) and a Cloudflare setup guide (`docs/cloudflare-setup.md`). There are no npm dependencies to install, no code refactoring, and no complex integrations. The main risk is getting the _redirects format exactly right for Cloudflare Pages (static before dynamic, wildcards with `:splat`) and documenting /packages/* routing which can't be fully verified until the WP origin is live.

The `cloudflare/wrangler-action@v3` is the recommended GitHub Action for deployment — it's the most current, well-maintained action with `pages deploy` support. The `cloudflare/pages-action@v1` is an older alternative. The workflow needs the `src-astro/` subdirectory handled correctly via `workingDirectory` since the Astro project isn't at repo root (D014).

## Recommendation

Build all five deliverables sequentially:

1. **`public/_redirects`** — 9 static blog URL redirects (date-segmented → clean), 5 dynamic WP infrastructure redirects (wildcards), 1 static /feed/ → /rss.xml. Static rules first per Cloudflare docs. Total: 15 redirects (well under 2,100 limit).
2. **`public/_headers`** — staging noindex (`*.pages.dev`), aggressive caching for `/_astro/*` (hashed filenames = immutable), moderate caching for HTML. No Fastly-specific headers (not mentioned in requirements).
3. **`public/robots.txt`** — Allow all crawlers, reference sitemap at `https://fair.pm/sitemap-index.xml`.
4. **`.github/workflows/deploy.yml`** at repo root — checkout, setup node, `npm ci` + `npm run build` in `src-astro/`, deploy via `wrangler-action@v3` with `pages deploy src-astro/dist`. Needs `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets.
5. **`docs/cloudflare-setup.md`** — Step-by-step: create Pages project, connect custom domain, DNS setup, configure /packages/* routing via Origin Rules, verify staging noindex, verify redirects.

Verify with: `npm run build` (confirms _redirects, _headers, robots.txt land in dist/), plus curl-based redirect tests against the built files (parse _redirects to verify format correctness — actual curl testing requires a running Cloudflare Pages deployment).

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| GitHub → Cloudflare Pages deploy | `cloudflare/wrangler-action@v3` | Official Cloudflare action, supports `pages deploy`, outputs deployment URL, well-maintained |
| Sitemap generation | `@astrojs/sitemap` (already installed) | Already configured in S01 with /packages/* filter — no additional work |
| RSS feed | `@astrojs/rss` (already installed) | Already generating /rss.xml from S03 |

## Existing Code and Patterns

- `src-astro/astro.config.mjs` — Site URL (`https://fair.pm`), sitemap with `/packages/` filter, Tailwind vite plugin. S05 does NOT need to modify this file.
- `src-astro/src/components/SEO.astro` — Has `noindex` prop support (renders `<meta name="robots" content="noindex,nofollow" />`). Staging noindex is handled via `_headers` file (X-Robots-Tag), not per-page props — these are separate mechanisms and both should work.
- `src-astro/src/utils/structured-data.ts` — Exports `SITE_URL = 'https://fair.pm'`. Use this constant in robots.txt sitemap reference and docs.
- `src-astro/package.json` — Build command is `astro build`, dev is `astro dev`. No lockfile-related constraints (no `package-lock.json` present — `npm ci` will generate one).
- `src-astro/dist/` — Build produces 41 files: 26 HTML pages, 5 WebP images, 1 CSS, 3 SVG, 1 ICO, 1 WOFF2, 1 MP4, 1 RSS XML, 2 sitemap XML. `_redirects`, `_headers`, and `robots.txt` from `public/` will be copied to `dist/` root automatically by Astro.
- `.gitignore` — Already ignores `dist/`, `node_modules/`, `.env` at repo root level. Adequate for CI.

## Constraints

- **Astro project is in `src-astro/` subdirectory (D014)** — GitHub Actions workflow must `cd src-astro` or use `working-directory` for build steps. The `wrangler-action` deploy command references `src-astro/dist` relative to repo root.
- **No `package-lock.json` currently** — `npm ci` requires a lockfile. Either generate one before committing, or use `npm install` in CI. Generating lockfile is better practice.
- **Cloudflare Pages _redirects limits** — 2,000 static + 100 dynamic = 2,100 max. S05 needs ~10 static + ~5 dynamic. Well within limits.
- **Static redirects must appear before dynamic redirects** in `_redirects` file. Cloudflare enforces ordering.
- **Cloudflare Pages `_headers` do NOT apply to Functions responses** — not a concern since we're pure static (no SSR, no Workers functions).
- **`_redirects` are always followed, regardless of whether an asset matches** — this means our static page URLs (like `/about/`) won't conflict with redirect rules since we only redirect changed URLs.
- **Cloudflare Pages doesn't natively proxy to a second origin** — /packages/* routing requires Cloudflare Origin Rules (dashboard config, not deployable via code) or a Cloudflare Worker. This is a documentation-only deliverable for S05.
- **No git remote configured** — The repo has no remote origin. The GitHub Actions workflow file can be created, but actual deployment requires pushing to a GitHub repo. This is a setup step documented in cloudflare-setup.md.
- **Two secrets required for CI** — `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` must be set in GitHub repo settings. These are documented, not collected via `secure_env_collect` (they're GitHub-side, not local).

## Common Pitfalls

- **_redirects wildcard format** — Cloudflare uses `*` for splat and `:splat` for the replacement. E.g., `/wp-admin/* / 301` redirects all wp-admin paths to root. Only one `*` per rule. Don't use regex.
- **Staging noindex header format** — Must use `https://:project.pages.dev/*` with the colon-prefix `:project` as a placeholder. Also need `https://:version.:project.pages.dev/*` for preview deployments. These are Cloudflare's specific header matching patterns.
- **Cache-Control on hashed assets** — Astro puts hashed assets in `/_astro/` with content-hash filenames (e.g., `structured-data.DRGr12qv.css`). These are safe for `immutable` caching. HTML files should have shorter cache TTL since they reference the hashed assets by name.
- **robots.txt sitemap reference** — Must be the full absolute URL (`https://fair.pm/sitemap-index.xml`), not a relative path. The sitemap is at `sitemap-index.xml` (Astro's default), not `sitemap.xml`.
- **Blog redirect date format** — WP URLs use `/blog/YYYY/MM/DD/slug/` format. Verify each date matches the `pubDate` frontmatter. One blog post's slug in WP might differ from the filename — double-check against research doc.
- **workingDirectory vs working-directory** — In `wrangler-action`, the parameter is `workingDirectory` (camelCase). In GitHub Actions' native `run` steps, it's `working-directory` (kebab-case). Don't mix them up.
- **Trailing slashes** — Astro generates `/blog/slug/index.html` (directory-style URLs with trailing slashes). Redirect targets should include trailing slashes to match: `/blog/slug/` not `/blog/slug`.
- **_headers path matching** — Cloudflare Pages `_headers` uses glob patterns. `/_astro/*` matches all files in the _astro directory. `/` matches only the root. `/*` matches everything.

## Open Risks

- **/packages/* routing can't be verified** — Origin Rules are configured in Cloudflare dashboard, not in code. The WP origin hostname/IP isn't known yet. Documentation will include step-by-step instructions but actual verification requires both origins live. This is acknowledged in M001 roadmap.
- **No git remote** — deploy.yml can be created and verified syntactically, but actual CI/CD testing requires pushing to GitHub. The workflow is simple enough to be correct-by-construction with the wrangler-action docs as reference.
- **Missing package-lock.json** — `npm ci` in CI will fail without it. Must generate one as part of S05 execution or switch to `npm install`.
- **Cloudflare API token permissions** — The token needs "Cloudflare Pages:Edit" permission scoped to the account. If the token has insufficient permissions, the deploy step will fail with a 403. Document required permissions in cloudflare-setup.md.
- **Branch-based deployment** — `wrangler-action` deploys all branches by default. Production should only deploy from `main`. The workflow trigger should be scoped to `push: branches: [main]` for production deploys. Preview deploys on PRs are a nice-to-have but not in S05 scope.

## Redirect Map (Complete)

### Static blog redirects (9) — WP date-segmented → clean URLs

| Old WP URL | New Astro URL |
|---|---|
| `/blog/2025/08/20/fair-plugin-version-0-4-0-decentralized-installation/` | `/blog/fair-plugin-version-0-4-0-decentralized-installation/` |
| `/blog/2025/09/24/discover-trust-install-fair-1-0-is-here/` | `/blog/discover-trust-install-fair-1-0-is-here/` |
| `/blog/2025/11/04/what-is-fair/` | `/blog/what-is-fair/` |
| `/blog/2025/11/09/fair-plugin-1-1-release-announcement/` | `/blog/fair-plugin-1-1-release-announcement/` |
| `/blog/2025/12/11/fair-connect-1-2-release-announcement/` | `/blog/fair-connect-1-2-release-announcement/` |
| `/blog/2025/12/22/fair-connect-1-2-1-release-announcement/` | `/blog/fair-connect-1-2-1-release-announcement/` |
| `/blog/2025/12/24/fair-connect-1-2-2-release-announcement/` | `/blog/fair-connect-1-2-2-release-announcement/` |
| `/blog/2026/01/25/2025-fair-recap/` | `/blog/2025-fair-recap/` |
| `/blog/2026/02/26/second-star-to-the-right-and-straight-on-till-morning/` | `/blog/second-star-to-the-right-and-straight-on-till-morning/` |

### Static feed redirect (1)

| Old URL | New URL |
|---|---|
| `/feed/` | `/rss.xml` |

### Dynamic WP infrastructure redirects (5) — wildcards

| Pattern | Target |
|---|---|
| `/wp-admin/*` | `/` |
| `/wp-login.php` | `/` |
| `/wp-content/*` | `/` |
| `/wp-json/*` | `/` |
| `/xmlrpc.php` | `/` |

**Total: 15 redirect rules (11 static + 4 dynamic). Well within limits.**

Note: `/wp-login.php` and `/xmlrpc.php` are static (no wildcard), not dynamic.

## Requirements Coverage

| Requirement | Role | What S05 delivers |
|---|---|---|
| **R006** (URL preservation) | **Primary owner** | `_redirects` file with 9 blog URL rewrites, 5 WP infrastructure redirects, 1 /feed/ redirect. All 301 status |
| **R010** (Cloudflare Pages deployment) | **Primary owner** | `deploy.yml` GitHub Action, `_headers` cache strategy + staging noindex, `docs/cloudflare-setup.md` |
| **R011** (/packages/* routing) | **Primary owner** | Documentation-only: Origin Rules config steps in cloudflare-setup.md. Cannot verify until WP origin is live |
| **R014** (robots.txt) | **Primary owner** | `public/robots.txt` with sitemap reference, all crawlers allowed |

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Cloudflare Pages | `itechmeat/llm-code@cloudflare-pages` (23 installs) | available — covers Pages deployment patterns |
| Cloudflare Pages | `baphomet480/claude-skills@cloudflare-pages` (23 installs) | available — alternative |
| GitHub Actions | `wshobson/agents@github-actions-templates` (6K installs) | available — general GHA templates, high install count |
| GitHub Actions | `callstackincubator/agent-skills@github-actions` (349 installs) | available — GHA-specific patterns |

**Assessment:** S05's scope is straightforward enough (5 static files + 1 doc) that skills aren't essential. The Cloudflare Pages docs from Context7 provide sufficient reference. The GitHub Actions templates skill (6K installs) could be useful if the workflow needs to be more complex, but the current requirements are a simple build-and-deploy pipeline.

## Sources

- Cloudflare Pages _redirects format: 2,000 static + 100 dynamic limit, static before dynamic, single `*` splat, `:splat` replacement (source: [Cloudflare Pages Redirects](https://developers.cloudflare.com/pages/configuration/redirects))
- Cloudflare Pages _headers: glob-based path matching, does NOT apply to Functions responses, supports X-Robots-Tag for noindex (source: [Cloudflare Pages Headers](https://developers.cloudflare.com/pages/configuration/headers))
- `cloudflare/wrangler-action@v3`: recommended over `pages-action@v1`, supports `pages deploy`, outputs deployment-url (source: [wrangler-action README](https://github.com/cloudflare/wrangler-action))
- Cloudflare Origin Rules: can override Host header + DNS for path-matched requests, configured via dashboard or API (source: [Cloudflare Origin Rules](https://developers.cloudflare.com/rules/origin-rules/))
- Blog URL redirect map cross-checked against `pubDate` frontmatter in all 9 `.md` files and original research doc (`Fairly static/fair-pm-astro-migration-research.md`)
- Astro build output: 41 files in `dist/`, `public/` contents copied to `dist/` root at build time
