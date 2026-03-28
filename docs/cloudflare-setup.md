# Cloudflare Pages Setup Guide — fair.pm

Step-by-step instructions for deploying the fair.pm Astro site to Cloudflare Pages with custom domain, CI/CD, and `/packages/*` routing to the WordPress origin.

## Prerequisites

- [ ] GitHub repository pushed to GitHub (public or private)
- [ ] Cloudflare account (free plan is sufficient for Pages)
- [ ] Domain `fair.pm` added to Cloudflare DNS (nameservers pointed to Cloudflare)
- [ ] `package-lock.json` committed in `src-astro/` (run `cd src-astro && npm install` to generate if missing)

---

## 1. Create Cloudflare Pages Project

### Option A: Via Dashboard

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account
3. Go to **Workers & Pages** → **Create**
4. Select the **Pages** tab
5. Click **Connect to Git**

### Option B: Via CLI

```bash
npx wrangler pages project create fair-pm
```

---

## 2. Connect GitHub Repository

1. In the Pages project creation flow, select **GitHub** as the git provider
2. Authorize Cloudflare to access your GitHub account (or organization)
3. Select the repository containing the fair.pm project
4. Set **Production branch** to `main`

---

## 3. Build Configuration

Configure these settings in the Pages project. These are fallback settings — the GitHub Actions workflow (`.github/workflows/deploy.yml`) handles the actual builds and deploys, but Pages needs these for initial setup and any manual triggers.

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | `cd src-astro && npm run build` |
| Build output directory | `src-astro/dist` |
| Root directory | `/` (repo root) |

> **Note:** Since the Astro project lives in the `src-astro/` subdirectory (not at repo root), the build command must `cd` into it first. The output directory is relative to the repo root.

---

## 4. GitHub Secrets

The GitHub Actions deploy workflow requires two secrets. Set them in your GitHub repository under **Settings → Secrets and variables → Actions → New repository secret**.

### CLOUDFLARE_ACCOUNT_ID

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account
3. The **Account ID** is displayed in the right sidebar on the account overview page
4. Copy the value
5. In GitHub, create a secret named `CLOUDFLARE_ACCOUNT_ID` with this value

### CLOUDFLARE_API_TOKEN

Create a token with minimum required permissions:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **My Profile** → **API Tokens**
2. Click **Create Token**
3. Select **Create Custom Token**
4. Configure:
   - **Token name:** `fair-pm-pages-deploy` (or similar descriptive name)
   - **Permissions:**
     - Account → Cloudflare Pages → **Edit**
   - **Account Resources:**
     - Include → Your specific account
   - **Zone Resources:**
     - Leave empty (Pages deploy doesn't need zone permissions)
   - **Client IP Address Filtering:**
     - Leave empty (GitHub Actions IPs rotate)
   - **TTL:**
     - Optional — set an expiry if your security policy requires it
5. Click **Continue to summary** → **Create Token**
6. Copy the token immediately (it won't be shown again)
7. In GitHub, create a secret named `CLOUDFLARE_API_TOKEN` with this value

> **Security:** Use the minimum permission scope. The token only needs `Cloudflare Pages:Edit` for the specific account — do not use a Global API Key.

---

## 5. Custom Domain

1. In the Cloudflare Dashboard, go to **Workers & Pages**
2. Select the `fair-pm` project
3. Go to **Custom domains** tab
4. Click **Set up a custom domain**
5. Enter `fair.pm`
6. Cloudflare will automatically configure the DNS record if the domain is already on Cloudflare DNS

### Optional: www redirect

To redirect `www.fair.pm` → `fair.pm`:

1. Add `www.fair.pm` as an additional custom domain in the Pages project, OR
2. Create a redirect rule in Cloudflare DNS/Rules

---

## 6. DNS Configuration

If Cloudflare did not auto-configure DNS in step 5, manually add:

| Type | Name | Content | Proxy |
|---|---|---|---|
| CNAME | `fair.pm` | `fair-pm.pages.dev` | Proxied (orange cloud) |

> **Important:** The CNAME must be proxied (orange cloud) for Cloudflare Pages to serve the site and for Origin Rules to work.

To verify DNS is resolving:

```bash
dig fair.pm CNAME +short
# Expected: fair-pm.pages.dev (or similar Cloudflare endpoint)
```

---

## 7. /packages/* Routing (Origin Rules)

The `/packages/*` path must route to the WordPress origin server so that plugin pages continue to be served by WordPress. This is configured via **Cloudflare Origin Rules** in the dashboard — it cannot be deployed via code.

> **Note:** This can only be fully verified when both the Astro site and the WordPress origin are live. Configure this after both origins are operational.

### Prerequisites

- The WordPress origin hostname or IP address must be known
- The WordPress site must be accessible at that hostname and serving `/packages/*` paths

### Configuration Steps

1. In the Cloudflare Dashboard, select the `fair.pm` zone
2. Go to **Rules** → **Origin Rules**
3. Click **Create rule**
4. Configure the rule:
   - **Rule name:** `Route /packages/* to WordPress origin`
   - **When incoming requests match…**
     - Field: **URI Path**
     - Operator: **starts with**
     - Value: `/packages/`
   - **Then…**
     - **Host Header** → Override to: `<wp-origin-hostname>` (e.g., `wp.fair.pm` or the WordPress server's hostname)
     - **DNS** → Override to: `<wp-origin-hostname>` (same hostname, or the origin IP address)
5. Click **Deploy**

### How It Works

- Requests to `fair.pm/packages/*` are intercepted by the Origin Rule before reaching Cloudflare Pages
- The Host Header and DNS overrides route these requests to the WordPress server instead
- The WordPress server receives the request with the overridden Host header and serves the packages pages
- All other paths (`/`, `/blog/*`, `/about/`, etc.) continue to be served by Cloudflare Pages

### Verification (once both origins are live)

```bash
# Should return WordPress-rendered package page
curl -sI https://fair.pm/packages/ | grep -i 'server\|x-powered-by'

# Should return Astro-rendered page
curl -sI https://fair.pm/ | grep -i 'server'

# Check a specific package page
curl -sI https://fair.pm/packages/starter-theme/ | head -20
```

---

## 8. Verify Deployment

After the first deploy completes (either via GitHub Actions push to `main` or manual trigger):

### Check site is live

```bash
curl -sI https://fair.pm/ | head -20
```

### Check redirects are working

```bash
# Blog date-segmented URL should 301 to clean URL
curl -sI https://fair.pm/blog/2025/08/20/fair-plugin-version-0-4-0-decentralized-installation/ | grep -i 'location\|HTTP'

# Feed redirect
curl -sI https://fair.pm/feed/ | grep -i 'location\|HTTP'

# WP admin redirect
curl -sI https://fair.pm/wp-admin/options-general.php | grep -i 'location\|HTTP'
```

### Check staging noindex (preview deployments)

```bash
# Replace <deployment-hash> with the actual preview URL
curl -sI https://<deployment-hash>.fair-pm.pages.dev/ | grep -i 'x-robots-tag'
# Expected: X-Robots-Tag: noindex
```

### Check robots.txt

```bash
curl -s https://fair.pm/robots.txt
# Expected:
# User-agent: *
# Allow: /
# Sitemap: https://fair.pm/sitemap-index.xml
```

### Check sitemap

```bash
curl -s https://fair.pm/sitemap-index.xml | head -20
```

### Check caching headers

```bash
# Hashed asset — should have immutable cache
curl -sI https://fair.pm/_astro/structured-data.DRGr12qv.css | grep -i 'cache-control'
# Expected: Cache-Control: public, max-age=31536000, immutable

# HTML page — should have revalidation cache
curl -sI https://fair.pm/ | grep -i 'cache-control'
# Expected: Cache-Control: public, max-age=0, must-revalidate
```

---

## 9. Troubleshooting

### Deploy fails: "Authentication error" or 403

- Verify `CLOUDFLARE_API_TOKEN` has **Cloudflare Pages:Edit** permission
- Verify the token is scoped to the correct **account**
- Verify `CLOUDFLARE_ACCOUNT_ID` matches the account where the Pages project exists
- API tokens expire if a TTL was set — create a new one if needed

### Deploy fails: "Project not found"

- The `--project-name=fair-pm` in `deploy.yml` must match the Pages project name exactly
- Create the project first (step 1) before the workflow runs

### Deploy fails: npm ci error

- Ensure `package-lock.json` exists in `src-astro/` and is committed to the repository
- Run `cd src-astro && npm install` locally and commit the generated lockfile

### Redirects not working

- Check the `_redirects` file is present at the root of the build output (`dist/_redirects`)
- Static redirects must appear before dynamic (wildcard) redirects
- Each rule must be on its own line with format: `<from> <to> <status>`
- Cloudflare Pages silently ignores malformed rules — no build error will occur
- Test with `curl -sI <url>` to check the actual response

### Staging noindex not appearing

- The `_headers` patterns use Cloudflare's `:project` syntax: `https://:project.pages.dev/*`
- This only applies to `*.pages.dev` URLs, not the custom domain
- Verify with: `curl -sI https://<hash>.fair-pm.pages.dev/ | grep x-robots-tag`

### /packages/* not routing to WordPress

- Verify the Origin Rule is configured in the correct zone (`fair.pm`)
- The rule must match URI Path **starts with** `/packages/`
- Both Host Header and DNS overrides must point to the WordPress origin
- The WordPress origin must be reachable and responding
- Check Cloudflare's **Security → Events** log for any blocked requests

### Build succeeds but pages show 404

- Verify the build output directory is `src-astro/dist` (relative to repo root)
- Check that the `wrangler-action` step uses `pages deploy dist` with `workingDirectory: src-astro`
- Inspect the deployment in the Cloudflare Pages dashboard to see which files were deployed
