---
id: T02
parent: S05
milestone: M001
provides:
  - GitHub Actions deploy workflow for Cloudflare Pages
key_files:
  - .github/workflows/deploy.yml
key_decisions: []
patterns_established:
  - GitHub Actions workflows live at repo root .github/workflows/, use working-directory for src-astro/ subdirectory steps, and workingDirectory (camelCase) for wrangler-action
observability_surfaces:
  - GitHub Actions workflow run logs (success/failure per step)
  - wrangler-action outputs deployment-url on successful deploy
duration: 5m
verification_result: passed
completed_at: 2026-03-27
blocker_discovered: false
---

# T02: Create GitHub Actions deploy workflow

**Created `.github/workflows/deploy.yml` — automated CI/CD pipeline that builds the Astro site and deploys to Cloudflare Pages on every push to main.**

## What Happened

Created a single GitHub Actions workflow file at the repo root with five steps: checkout, Node.js LTS setup with npm cache, `npm ci` install, `npm run build`, and Cloudflare Pages deploy via `cloudflare/wrangler-action@v3`. The workflow correctly handles the `src-astro/` subdirectory by using `working-directory` (kebab-case) for native run steps and `workingDirectory` (camelCase) for the wrangler action parameter. A concurrency group prevents parallel deploys. Secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are referenced by name only — they must be configured in GitHub before the workflow will succeed.

## Verification

All task-level checks passed:
- File exists at `.github/workflows/deploy.yml` (repo root)
- Uses `cloudflare/wrangler-action@v3`
- Triggers on push to `branches: [main]` only
- References `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets
- `working-directory: src-astro` on npm ci and build steps
- `workingDirectory: src-astro` on wrangler action
- `concurrency: group: deploy` present
- Uses `actions/checkout@v4` and `actions/setup-node@v4`
- `cache-dependency-path: 'src-astro/package-lock.json'` configured
- Deploy command: `pages deploy dist --project-name=fair-pm`
- YAML syntax validated via yaml-lint (no parse errors)

Slice-level verification:
- V12 PASS: `.github/workflows/deploy.yml` exists at repo root
- V13 PASS: `grep 'wrangler-action'` confirms correct Cloudflare action
- V14 PASS: `grep 'branches.*main'` confirms scoped to main branch

## Diagnostics

- GitHub Actions tab shows workflow run history with per-step logs
- wrangler-action outputs `deployment-url` on success — capturable in downstream steps
- Workflow failures surface which step failed (checkout, install, build, or deploy)
- Locally inspect with: `cat .github/workflows/deploy.yml`

## Deviations

None.

## Known Issues

None. Workflow is syntactically valid but untested against GitHub Actions — requires pushing to GitHub with configured secrets.

## Files Created/Modified

- `.github/workflows/deploy.yml` — GitHub Actions CI/CD workflow for automated Cloudflare Pages deployment
