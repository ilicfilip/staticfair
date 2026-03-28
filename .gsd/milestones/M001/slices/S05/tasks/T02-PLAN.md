---
estimated_steps: 4
estimated_files: 1
---

# T02: Create GitHub Actions deploy workflow

**Slice:** S05 — Deployment & Redirects
**Milestone:** M001

## Description

Create the CI/CD pipeline that automatically deploys the Astro site to Cloudflare Pages when code is pushed to the main branch. The workflow handles the `src-astro/` subdirectory correctly (D014), uses the official `cloudflare/wrangler-action@v3`, and references GitHub secrets for authentication.

## Steps

1. Create `.github/workflows/deploy.yml` at the **repo root** (not inside src-astro/). Structure:
   - Trigger: `on: push: branches: [main]`
   - Single job `deploy` running on `ubuntu-latest`
   - Step 1: `actions/checkout@v4`
   - Step 2: `actions/setup-node@v4` with `node-version: 'lts/*'` and `cache: 'npm'` with `cache-dependency-path: 'src-astro/package-lock.json'`
   - Step 3: `run: npm ci` with `working-directory: src-astro`
   - Step 4: `run: npm run build` with `working-directory: src-astro`
   - Step 5: `cloudflare/wrangler-action@v3` with:
     - `apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}`
     - `accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}`
     - `command: pages deploy dist --project-name=fair-pm`
     - `workingDirectory: src-astro` (camelCase — this is the wrangler action parameter)

2. Add a concurrency group to prevent parallel deploys:
   - `concurrency: group: deploy, cancel-in-progress: false`

3. Validate YAML syntax by parsing with a command-line tool or manual inspection.

4. Verify the file references the correct paths, secret names, and action versions.

## Must-Haves

- [ ] Workflow triggers only on push to `main` branch
- [ ] Uses `actions/checkout@v4` and `actions/setup-node@v4`
- [ ] Node setup caches npm with correct `cache-dependency-path` pointing to `src-astro/package-lock.json`
- [ ] `npm ci` and `npm run build` use `working-directory: src-astro` (kebab-case)
- [ ] Deploy step uses `cloudflare/wrangler-action@v3` with `workingDirectory: src-astro` (camelCase)
- [ ] Secrets referenced: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`
- [ ] Deploy command: `pages deploy dist --project-name=fair-pm`
- [ ] Concurrency group prevents parallel deploys

## Verification

- `test -f .github/workflows/deploy.yml` — file exists at repo root
- `grep 'wrangler-action' .github/workflows/deploy.yml` — uses correct action
- `grep 'branches.*main' .github/workflows/deploy.yml` — scoped to main
- `grep 'CLOUDFLARE_API_TOKEN' .github/workflows/deploy.yml` — API token referenced
- `grep 'CLOUDFLARE_ACCOUNT_ID' .github/workflows/deploy.yml` — account ID referenced
- `grep 'working-directory.*src-astro' .github/workflows/deploy.yml` — correct working directory for build steps
- `grep 'workingDirectory.*src-astro' .github/workflows/deploy.yml` — correct working directory for wrangler action
- YAML is syntactically valid (no parse errors)

## Observability Impact

- Signals added/changed: GitHub Actions workflow produces deployment logs with success/failure status, deployment URL output from wrangler-action
- How a future agent inspects this: Check GitHub Actions tab for workflow runs; wrangler-action outputs `deployment-url` that can be captured
- Failure state exposed: GitHub Actions failure notifications; workflow logs show exact step that failed (checkout, install, build, or deploy)

## Inputs

- `src-astro/package.json` — confirms build command is `astro build`, dev script exists
- `src-astro/package-lock.json` — exists, enabling `npm ci` in CI
- D014 decision — Astro project lives in `src-astro/` subdirectory
- S05-RESEARCH.md — wrangler-action@v3 usage details, workingDirectory vs working-directory distinction

## Expected Output

- `.github/workflows/deploy.yml` — complete CI/CD workflow that, when pushed to GitHub with configured secrets, will build and deploy the Astro site to Cloudflare Pages on every push to main
