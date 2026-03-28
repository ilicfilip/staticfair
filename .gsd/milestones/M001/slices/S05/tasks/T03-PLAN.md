---
estimated_steps: 4
estimated_files: 1
---

# T03: Write Cloudflare setup documentation and run full verification

**Slice:** S05 — Deployment & Redirects
**Milestone:** M001

## Description

Write the step-by-step Cloudflare Pages setup guide that covers everything a human needs to go from zero to a live deployment: Pages project creation, GitHub connection, build configuration, custom domain, DNS, /packages/* routing via Origin Rules, GitHub secret configuration, and post-deploy verification commands. Then run the complete V1–V17 verification sweep to confirm all S05 deliverables work together.

## Steps

1. Create `docs/cloudflare-setup.md` at the repo root with these sections:
   - **Prerequisites**: GitHub repo pushed, Cloudflare account, domain (fair.pm) on Cloudflare DNS
   - **1. Create Cloudflare Pages project**: Dashboard steps or `wrangler pages project create fair-pm`
   - **2. GitHub connection**: Connect repo, set production branch to `main`
   - **3. Build configuration**: Framework preset: None, Build command: `cd src-astro && npm run build`, Output directory: `src-astro/dist`, Root directory: `/` (repo root). Note: These are fallback settings — the GitHub Actions workflow handles builds, but Pages needs these for the initial setup.
   - **4. GitHub Secrets**: `CLOUDFLARE_API_TOKEN` (needs "Cloudflare Pages:Edit" permission scoped to account) and `CLOUDFLARE_ACCOUNT_ID` (found in Cloudflare dashboard sidebar). Step-by-step for creating API token with minimum permissions.
   - **5. Custom domain**: Add `fair.pm` as custom domain in Pages project settings
   - **6. DNS configuration**: CNAME record pointing fair.pm to `fair-pm.pages.dev` (or appropriate setup)
   - **7. /packages/* routing**: Step-by-step Origin Rules configuration in Cloudflare dashboard — match URI path starting with `/packages/`, override Host Header and DNS to WP origin. Note that WP origin hostname/IP must be known. Include a note that this can only be verified when both origins are live.
   - **8. Verify deployment**: curl commands to check redirects, noindex header on staging, robots.txt, sitemap
   - **9. Troubleshooting**: Common issues (token permissions, build failures, redirect not working)

2. Ensure all Cloudflare-specific terminology and dashboard paths are accurate (use research findings).

3. Run the full V1–V17 verification sweep:
   - Build: `cd src-astro && npm run build`
   - V1–V11: _redirects, _headers, robots.txt content checks
   - V12–V14: deploy.yml existence and content checks
   - V15–V16: docs existence and content checks
   - V17: Build exits 0 with 26 pages, no regressions

4. Document verification results — all 17 checks must pass for slice completion.

## Must-Haves

- [ ] `docs/cloudflare-setup.md` exists at repo root
- [ ] Document covers Pages project creation, GitHub connection, build config, custom domain, DNS
- [ ] Document includes /packages/* Origin Rules routing instructions with clear note about WP origin dependency
- [ ] Document includes GitHub secrets setup with required API token permissions
- [ ] Document includes post-deploy verification curl commands
- [ ] All 17 slice verification checks (V1–V17) pass

## Verification

- `test -f docs/cloudflare-setup.md` — file exists at repo root
- `grep -i 'origin.rule\|packages' docs/cloudflare-setup.md` — /packages/* routing documented
- `grep -i 'CLOUDFLARE_API_TOKEN\|CLOUDFLARE_ACCOUNT_ID' docs/cloudflare-setup.md` — secrets documented
- `grep -i 'custom.domain\|fair\.pm' docs/cloudflare-setup.md` — domain setup documented
- Full V1–V17 sweep passes (see S05-PLAN.md Verification section)
- `npm run build` exits 0 with 26 pages — no regressions from T01/T02

## Observability Impact

- Signals added/changed: None — documentation is a static artifact
- How a future agent inspects this: Read `docs/cloudflare-setup.md` for Cloudflare configuration instructions. The doc itself includes diagnostic curl commands for verifying a live deployment.
- Failure state exposed: None at build time. The documentation captures how to diagnose runtime issues (redirect failures, noindex verification, /packages/* routing) post-deployment.

## Inputs

- `src-astro/public/_redirects` — from T01, needed for verification
- `src-astro/public/_headers` — from T01, needed for verification
- `src-astro/public/robots.txt` — from T01, needed for verification
- `.github/workflows/deploy.yml` — from T02, needed for verification
- S05-RESEARCH.md — Cloudflare Pages configuration details, Origin Rules documentation, API token permissions
- S05-RESEARCH.md — constraint that /packages/* routing is documentation-only (can't verify until WP origin is live)

## Expected Output

- `docs/cloudflare-setup.md` — comprehensive setup guide with all sections, actionable for a human operator
- Full V1–V17 verification results documented — all passing
