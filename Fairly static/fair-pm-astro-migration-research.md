# fair.pm Migration to Astro: Research Findings

## Current State of fair.pm

The site is currently a WordPress installation with a custom theme (`fair-parent-theme`). It serves around 20+ pages across these sections:

- **Homepage** with release announcements, project description, CTAs
- **About FAIR** (mandate, initiatives, roadmap)
- **Packages** (plugins, themes)
- **Governance** (TSC, Linux Foundation, code of conduct, antitrust policy, privacy policy, terms of use)
- **Blog** (9 posts, mostly release announcements and project updates, date range Aug 2025 to Feb 2026)
- **Get Involved** (Slack, meetings, working groups)
- **Knowledge Base**

The site is content-heavy and largely static. There is no evidence of dynamic features like user accounts, comments, or e-commerce. External links point to GitHub repos, Slack (chat.fair.pm), Zoom meetings via Linux Foundation, and the Linux Foundation itself.

### Existing SEO setup

What's present:
- Schema.org structured data (WebPage, ImageObject, BreadcrumbList, WebSite with SearchAction) via JSON-LD
- Open Graph image tag
- Publication/modification dates in meta
- Language declaration (en-US)

What's missing or broken:
- No `robots.txt` (returns 404)
- No `sitemap.xml` (returns 404)
- No meta description tag visible
- No Twitter Card tags
- No canonical URL tags visible
- Heavy WordPress CSS/JS payload for what is essentially static content

---

## Why Astro Is a Good Fit

Astro was built for exactly this kind of site: content-heavy, mostly static, with minimal interactivity. Some specifics worth noting:

**It's just HTML.** Astro's `.astro` component syntax is a superset of HTML. Existing page content can be migrated without learning a new templating language. This also means the team doesn't need React/Vue/Svelte expertise to maintain the site.

**Zero JavaScript by default.** Unlike WordPress (which ships block editor CSS, prefetch scripts, menu JS, and lightbox libraries even for static content), Astro generates plain HTML with no client-side JS unless you explicitly opt in. This directly improves page load times, which matters for both users and search engines.

**Content Collections.** Astro's content collection system lets you manage groups of related content files (like blog posts) with a shared, validated schema. Here's how it works: instead of each blog post being a standalone `.astro` page where you manually wire up the title, date, description, and layout, you put all your Markdown blog posts in a single folder (`src/content/blog/`) and define a schema once using Zod that says "every blog post must have a title (string), a date (date), a description (string), and optionally an image (string)."

Astro validates every file in that folder against the schema at build time. If someone adds a blog post and forgets the description, the build fails with a clear error instead of silently deploying a page with missing meta tags. You also get a typed API to query and sort posts (e.g., `getCollection('blog')` returns all posts, which you can sort by date), and this is how the blog listing page and RSS feed are powered.

Blog posts are the clear candidate for a content collection because they all share the same structure: title, date, author, body content, same layout template. Governance pages like "Code of Conduct" and "Antitrust Policy" are one-offs with different layouts and content structures, so those are better as plain `.astro` page files. Don't over-engineer this with ~20 pages.

**Islands Architecture.** If you ever need interactive components (say, a package search feature or a meeting calendar widget), you can add them as isolated "islands" that hydrate independently. The rest of the page stays as static HTML.

---

## Migration Plan: What Needs to Happen

### 1. Project Setup

```
npm create astro@latest fair-pm
```

Key configuration decisions:
- **Output mode:** `static` (pre-rendered HTML, no server needed for most pages)
- **Adapter:** `@astrojs/cloudflare` if any pages need SSR (e.g., dynamic package search). Otherwise, pure static output works on Cloudflare Pages without an adapter.
- **TypeScript:** Recommended for content collection schemas and type safety across the site.

### 2. Content Source

Page content lives in the [`fairpm/website-content`](https://github.com/fairpm/website-content) GitHub repo. Its structure mirrors the site's URL hierarchy:

```
fairpm/website-content/
  about/
    index.md
    fair-initiatives.md
    fairs-mandate.md
  assets/
    images.md
    maxresdefault.jpg
    release-1.0/
  get-involved/
  governance/
    index.md
    antitrust-policy.md
    code-of-conduct.md
    linux-foundation.md
    privacy-policy.md
    technical-steering-committee.md
    terms-of-use.md
  packages/
  CONTRIBUTING.md
  README.md
  fair-knowledge-base.md
  index.md
```

This repo is the source of truth for page text and some assets. Blog posts and design characteristics (theme, styles) are currently managed within WordPress and are not in this repo. The README notes that theme issues go to the `fairpm/fair-parent-theme` repo and package explorer issues go to `fairpm/AspireExplorer`.

For the migration, page content should be pulled from this repo. Blog post content will need to be extracted from the live WordPress site (or a WordPress export) since it doesn't appear to be stored here.

### 3. Content Migration

**Blog posts** should become a content collection:

```
src/content/blog/
  2025-09-24-fair-1-0-is-here.md
  2025-11-04-what-is-fair.md
  2025-11-09-fair-plugin-1-1.md
  ...
```

Each file would have frontmatter like:
```yaml
---
title: "Discover, trust, install: FAIR 1.0 is here"
date: 2025-09-24
description: "FAIR 1.0 launch announcement..."
author: "FAIR Team"
tags: ["release", "announcement"]
image: "/images/blog/fair-1-0-hero.png"
---
```

**Static pages** (About, Governance, Get Involved, Knowledge Base) should be plain `.astro` files in `src/pages/`. These pages rarely change, have unique layouts, and there are only ~20 of them. Content collections would add unnecessary complexity here.

### 4. Layout and Component Architecture

```
src/
  layouts/
    BaseLayout.astro      (HTML head, header, footer, SEO component)
    BlogPost.astro        (extends Base, adds article markup, date, author)
  components/
    Header.astro          (navigation, Linux Foundation banner)
    Footer.astro
    SEO.astro             (meta tags, OG, Twitter, JSON-LD)
    BlogCard.astro        (post preview for blog listing)
  pages/
    index.astro
    about/
      index.astro
      fairs-mandate.astro
      fair-initiatives.astro
      roadmap.astro
    packages/
      index.astro
      plugins.astro
      themes.astro
    governance/
      index.astro
      technical-steering-committee.astro
      ...
    blog/
      index.astro         (blog listing)
      [...slug].astro     (dynamic route from content collection)
    get-involved/
      index.astro
      fair-working-groups.astro
    fair-knowledge-base/
      index.astro
  content/
    blog/                 (markdown files)
    config.ts             (collection schemas)
  styles/
    global.css            (design tokens, typography, base styles)
```

### 5. Asset Migration

- Pull images from the `fairpm/website-content` repo's `assets/` directory. Blog post images may need to be extracted from WordPress separately.
- Place in `src/assets/` (for Astro's built-in image optimization) or `public/` (for unprocessed assets like favicons)
- Astro's `<Image>` component auto-converts to WebP/AVIF, adds width/height attributes (preventing layout shift), and lazy-loads by default

### 6. Deployment: Cloudflare Pages

Two paths depending on whether you need SSR:

**Static only (recommended starting point):**
- Build locally or in CI with `astro build`
- Output goes to `dist/`
- Cloudflare Pages serves it directly, no adapter needed
- Connect GitHub repo to Cloudflare Pages dashboard for automatic deploys on push

**With SSR for specific routes:**
- Install `@astrojs/cloudflare` adapter
- Mark specific pages as server-rendered with `export const prerender = false`
- Cloudflare Workers handles those routes; everything else is static

**Fastly consideration:** If you're using Fastly as a CDN in front of Cloudflare (or instead of it), the static HTML output works the same way. Fastly would just cache and serve the files. Use `Surrogate-Control` headers for Fastly-specific cache TTLs separate from browser `Cache-Control`.

### 7. GitHub Workflow

```yaml
# .github/workflows/deploy.yml (example)
name: Deploy to Cloudflare Pages
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/wrangler-action@v3
        with:
          command: pages deploy dist --project-name=fair-pm
```

---

## SEO Improvements for the Static Site

### Critical Fixes (things that are broken or missing today)

**1. Add a sitemap**

Install `@astrojs/sitemap` and set the `site` property in `astro.config.mjs`:

```js
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://fair.pm',
  integrations: [sitemap()],
});
```

This generates `sitemap-index.xml` and individual sitemap files at build time. No maintenance needed.

**2. Add robots.txt**

Either use the `astro-robots-txt` package or create `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://fair.pm/sitemap-index.xml
```

AI crawlers (GPTBot, CCBot, Google-Extended, etc.) should be allowed. The more AI models know about FAIR, the better for the project's visibility and discoverability.

**3. Add meta descriptions to every page**

Every page needs a unique, descriptive meta description (120-160 characters). These are currently absent. With a reusable SEO component in Astro, this becomes a required prop that's hard to forget:

```astro
---
// src/components/SEO.astro
interface Props {
  title: string;
  description: string;  // Required, not optional
  image?: string;
  type?: string;
}
---
```

**4. Add canonical URLs**

Use `Astro.url.href` to generate canonical URLs automatically, preventing duplicate content issues (especially important if the site is accessible via both `fair.pm` and a `*.pages.dev` subdomain):

```html
<link rel="canonical" href={Astro.url.href} />
```

**5. Add Twitter Card tags**

The site has OG tags but no Twitter Cards. Add both in the SEO component:

```html
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={image} />
<meta property="og:url" content={Astro.url.href} />
<meta property="og:type" content={type || 'website'} />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={image} />
```

### Structural SEO Improvements

**6. Improve structured data**

The current site has decent Schema.org markup. Migrate and expand it:

- `WebSite` with `SearchAction` on the homepage
- `Organization` for FAIR/Linux Foundation details
- `BlogPosting` for each blog post (with `author`, `datePublished`, `dateModified`)
- `BreadcrumbList` for navigation hierarchy
- `WebPage` for standard pages

Implement as a reusable component using JSON-LD:

```astro
<script type="application/ld+json" set:html={JSON.stringify(structuredData)} />
```

**7. Semantic HTML throughout**

This is where Astro gives you a fresh start. Ensure:
- One `<h1>` per page (WordPress sites often have multiple due to widget areas)
- Proper heading hierarchy (no skipping levels)
- `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>` used correctly
- Skip links for keyboard navigation (`<a href="#main-content" class="sr-only">Skip to content</a>`)
- All images have descriptive `alt` text (Astro's `<Image>` component makes `alt` a required prop)

**8. Blog post URL structure**

The current WordPress URLs include full dates: `/blog/2026/02/26/post-slug/`. The recommended Astro structure is cleaner: `/blog/post-slug/`. This is better for sharing, easier to type, and works better for content that stays relevant over time. The date is still available in the post metadata and displayed on the page; it just doesn't need to be in the URL.

This means every existing blog post URL will change and needs a 301 redirect. See the full redirect map below in "URL Redirect Map."

### Performance-Based SEO

**9. Eliminate WordPress bloat**

This is arguably the biggest SEO win. The current site loads:
- WordPress block library CSS (even for pages that don't use all block types)
- Gutenberg inline styles
- Prefetch scripts
- Menu interaction JS
- Lightbox JS

Astro ships none of this. The static HTML output means near-instant page loads, which directly improves Core Web Vitals (LCP, INP, CLS) and therefore search rankings.

**10. Image optimization**

Use Astro's built-in `<Image>` component for:
- Automatic WebP/AVIF conversion (25-50% smaller than PNG/JPEG)
- Responsive `srcset` generation
- Width/height attributes to prevent CLS
- Lazy loading for below-the-fold images
- Required `alt` text (good for accessibility AND SEO)

**11. Font loading strategy**

If the site uses web fonts, use `font-display: swap` and preload critical fonts:

```html
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin />
```

### Cloudflare/Fastly-Specific SEO

**12. Prevent indexing during development (X-Robots-Tag)**

While the site is being built and not yet deployed to fair.pm, block all indexing on the staging/preview URLs. Add a `_headers` file in `public/`:

```
# PRE-LAUNCH: Block all indexing on pages.dev URLs
# This prevents search engines from indexing the staging site
https://:project.pages.dev/*
  X-Robots-Tag: noindex

https://:version.:project.pages.dev/*
  X-Robots-Tag: noindex
```

**REMINDER (TODO before go-live):** When the site is published to the final `fair.pm` domain, keep the `pages.dev` noindex rules but make sure the production domain does NOT have `X-Robots-Tag: noindex`. The `_headers` rules above are scoped to `pages.dev` subdomains only, so they won't affect the production domain. Verify this is working correctly after DNS cutover by checking the response headers on `fair.pm` with `curl -I https://fair.pm`.

**13. Cache strategy**

For Cloudflare:
```
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=3600
```

For Fastly (if used):
```
Surrogate-Control: max-age=86400
Cache-Control: max-age=3600
```

This gives Fastly a longer edge cache (24h) while keeping browsers fresher (1h). Fastly strips `Surrogate-Control` before sending to the client.

**14. Use Surrogate-Key tagging on Fastly**

Tag responses by content type so you can do targeted purges:

```
Surrogate-Key: blog post-2026-02-26 page-type-blog
```

Then purge all blog content at once via Fastly's API when you publish a new post.

### Accessibility Improvements That Also Help SEO

**15. ARIA landmarks and roles**

Ensure all major page regions have appropriate ARIA roles. Screen readers and crawlers both benefit from clear content structure.

**16. Color contrast**

Check that all text meets WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text). Low contrast hurts readability, increases bounce rates, and indirectly affects rankings.

**17. Focus management**

Visible focus indicators on all interactive elements. This is an accessibility requirement, but it also reduces the "pogo-sticking" behavior that search engines track.

**18. Language attributes**

Set `lang="en"` on the `<html>` element. If you add multilingual support later, Astro has built-in i18n routing.

---

## URL Redirect Map

The following 301 redirects should be added to `public/_redirects` (Cloudflare Pages format). Blog posts change because we're dropping the date segments from URLs. Static pages should keep their existing URL structure, so no redirects are needed for those.

```
# public/_redirects
# Format: old-path new-path status-code

# Blog posts (date-based WordPress URLs -> clean Astro URLs)
/blog/2025/09/24/discover-trust-install-fair-1-0-is-here/  /blog/discover-trust-install-fair-1-0-is-here/  301
/blog/2025/08/20/fair-plugin-version-0-4-0-decentralized-installation/  /blog/fair-plugin-version-0-4-0-decentralized-installation/  301
/blog/2025/11/04/what-is-fair/  /blog/what-is-fair/  301
/blog/2025/11/09/fair-plugin-1-1-release-announcement/  /blog/fair-plugin-1-1-release-announcement/  301
/blog/2025/12/11/fair-connect-1-2-release-announcement/  /blog/fair-connect-1-2-release-announcement/  301
/blog/2025/12/22/fair-connect-1-2-1-release-announcement/  /blog/fair-connect-1-2-1-release-announcement/  301
/blog/2025/12/24/fair-connect-1-2-2-release-announcement/  /blog/fair-connect-1-2-2-release-announcement/  301
/blog/2026/01/25/2025-fair-recap/  /blog/2025-fair-recap/  301
/blog/2026/02/26/second-star-to-the-right-and-straight-on-till-morning/  /blog/second-star-to-the-right-and-straight-on-till-morning/  301

# WordPress infrastructure URLs (no equivalent in static site)
/wp-admin/*  /  301
/wp-login.php  /  301
/wp-content/*  /  301
/wp-json/*  /  301
/xmlrpc.php  /  301
/feed/  /rss.xml  301

# Static pages: these should keep their current URL structure in Astro,
# so no redirects needed for:
#   /about/
#   /about/fairs-mandate/
#   /about/fair-initiatives/
#   /about/roadmap/
#   /packages/
#   /packages/plugins/
#   /packages/themes/
#   /governance/
#   /governance/technical-steering-committee/
#   /governance/linux-foundation/
#   /governance/code-of-conduct/
#   /governance/antitrust-policy/
#   /governance/privacy-policy/
#   /governance/terms-of-use/
#   /blog/
#   /get-involved/
#   /get-involved/fair-working-groups/
#   /fair-knowledge-base/
```

Note: If any additional blog posts are published on the WordPress site before migration, their redirects will need to be added here too.

---

## Risks and Things to Watch Out For

**URL parity.** If the new site's URL structure doesn't match WordPress exactly, you'll lose any existing search rankings. Plan 301 redirects for every URL that changes. Cloudflare Pages supports `_redirects` files for this.

**Content parity.** Don't lose content during migration. Do a page-by-page audit comparing the WordPress site to the Astro build before going live.

**WordPress-specific features.** The current site uses a SearchAction in its schema. If you want site search on the static site, you'll need to implement it (Pagefind is a popular static-site search library that works well with Astro) or remove the SearchAction from the schema.

**RSS feed.** The site should include an RSS feed for the blog. Astro doesn't generate one by default, but `@astrojs/rss` makes it straightforward. Create a `src/pages/rss.xml.ts` file that queries the blog content collection and outputs a standard RSS 2.0 feed. This pairs naturally with content collections: the same schema that validates your blog posts also provides the data for the feed.

**Link rot from GitHub content.** The site references GitHub repos extensively. These links should be validated during the build or monitored, since GitHub URLs can change when branches are renamed or files are moved.

**`pages.dev` duplicate content.** This is a real and common problem. The `_headers` noindex rules above handle it for staging. After go-live, also set the canonical domain in Cloudflare's dashboard to ensure `pages.dev` URLs are never treated as authoritative.

---

## Recommended Package List

```json
{
  "dependencies": {
    "astro": "latest",
    "@astrojs/sitemap": "latest",
    "@astrojs/mdx": "latest",
    "@astrojs/rss": "latest",
    "astro-seo": "latest"
  },
  "devDependencies": {
    "@astrojs/cloudflare": "latest",
    "schema-dts": "latest",
    "sharp": "latest"
  }
}
```

Note: `robots.txt` is handled as a static file in `public/`, so no package needed for that.

## Next Steps

1. Initialize the Astro project in this directory
2. Set up the base layout and SEO component
3. Migrate the homepage as a proof of concept
4. Set up the blog content collection and migrate posts
5. Migrate remaining pages section by section
6. Configure Cloudflare Pages deployment
7. Set up 301 redirects from all old WordPress URLs
8. Validate with Lighthouse, Schema.org validator, and manual testing
