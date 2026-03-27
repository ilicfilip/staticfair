# S01: Astro Foundation & Layout System — Research

**Date:** 2026-03-27

## Summary

This slice sets up the Astro project scaffold, layout system, and design token infrastructure that every subsequent slice depends on. The deliverables are: `astro.config.mjs`, `BaseLayout.astro`, `Header.astro` (unstyled skeleton), `Footer.astro` (unstyled skeleton), `SEO.astro` (meta tag component), Tailwind CSS configuration with brand color tokens, `global.css` with Mona Sans `@font-face`, and the self-hosted variable font file. After this slice, `astro dev` serves a working homepage at localhost with the full layout shell.

Astro 6.x is the current stable release and is the right choice. It ships stable Font API support (promoted from experimental in v6), stable content collections with glob loaders, and native Tailwind 4 support via Vite plugin. The project should use Tailwind CSS v4 (CSS-first configuration with `@theme` directive) rather than Tailwind v3 (JS config file), since Astro 5.2+ provides first-class `npx astro add tailwind` support for v4.

The key architectural decision for this slice is how to handle the Mona Sans variable font. Astro 6's Font API (`fontProviders.local()` + `<Font />` component) is the modern approach, but it's newly stable and adds coupling to Astro internals. The simpler, proven approach is a manual `@font-face` declaration in `global.css` with a preload link in the layout — this is fully portable and well-understood. The recommendation is to use the manual `@font-face` approach for reliability, with the Font API as a documented alternative if the team wants to migrate later.

## Recommendation

**Use Astro 6.x with Tailwind CSS v4, manual @font-face for Mona Sans, and a hand-built SEO component.**

1. **Astro 6.x** — Current stable. Use static output mode (no SSR adapter). TypeScript enabled.
2. **Tailwind CSS v4** — Via `@tailwindcss/vite` plugin. Configure brand tokens using `@theme` directive in CSS (no `tailwind.config.mjs` needed in v4). This is cleaner than v3's JS config.
3. **Mona Sans font** — Manual `@font-face` in `global.css` pointing to `public/fonts/monasansvf.woff2`. Preload in BaseLayout's `<head>`. The Astro Font API is stable but adds unnecessary complexity for a single self-hosted variable font.
4. **SEO component** — Build custom `SEO.astro` rather than using `astro-seo` package. The component is simple (meta tags, OG, Twitter Cards, canonical URL, JSON-LD slot), and a custom component gives full control without a dependency. The props interface also serves as documentation for what every page must provide.
5. **Content collections** — Define the blog collection schema in `src/content.config.ts` now (using glob loader), even though S03 will populate it. This ensures the schema is ready and the config file is in place.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Sitemap generation | `@astrojs/sitemap` | Auto-generates from routes, supports `filter()` to exclude `/packages/*` paths |
| RSS feed | `@astrojs/rss` | Standard RSS 2.0 output from content collections, maintained by Astro team |
| Image optimization | Astro `<Image>` (built-in) | Auto WebP/AVIF, responsive srcset, required alt text, CLS prevention — zero config |
| Markdown processing | Astro content collections + glob loader | Built-in Zod schema validation, typed queries, no extra dependencies |
| CSS framework | Tailwind CSS v4 via `@tailwindcss/vite` | First-class Astro support, CSS-first config, utility-first — already decided (D002) |

## Existing Code and Patterns

- `Fairly static/fair-pm-astro-migration-research.md` — Comprehensive migration research with URL redirect map, SEO analysis, package recommendations, nav structure, and deployment strategy. **Use as primary reference** for page inventory, blog post list, and redirect mapping.
- **M001-CONTEXT.md design tokens** — CSS custom properties for colors and typography extracted from the live WP theme. Copy these values directly into Tailwind's `@theme` block. Note: `--color-green: #25b372` fails WCAG AA (3.2:1 on white) — S02 will fix this, but S01 should include the raw value as-is.
- **fairpm/website-content** (GitHub) — Source Markdown for static pages. S01 doesn't consume content, but the file structure informs the `src/pages/` hierarchy.
- **fair-parent-theme** (WP theme) — Source of design tokens, font file, and nav structure. The Mona Sans `.woff2` file needs to be downloaded from `https://fair.pm/content/themes/fair-parent-theme/fonts/monasansvf.woff2`.

## Constraints

- **Static output only** — No SSR adapter. `output: 'static'` in `astro.config.mjs`. This is a hard constraint (D001, D004).
- **TypeScript enabled** — Use `strict` tsconfig preset (D001).
- **Single repo** — Code and content in one repository (D006). Content collections configured for `src/content/blog/`.
- **Mona Sans variable font, self-hosted** — Must not use CDN. The `.woff2` file goes in `public/fonts/` and is preloaded (D003).
- **Tailwind CSS** — Required for all styling. CSS custom properties for brand tokens so colors can be changed without rebuilding (D002).
- **SEO component props are the contract** — The `SEO.astro` interface defines what every page must provide: `title`, `description`, `canonicalURL`, `ogImage`, `ogType`, `twitterCard`, and a `jsonLd` slot/prop. This is the S01→S04 boundary.
- **Header/Footer are structural skeletons** — S01 produces correct HTML structure and navigation links. S02 applies visual styling, responsive behavior, and accessibility enhancements. Don't over-style in S01.
- **Astro 6.x content collection syntax** — Uses `src/content.config.ts` (not `src/content/config.ts`), `glob()` loader, and `z` from `astro/zod`. The v5→v6 migration changed the file location and import paths.

## Common Pitfalls

- **Wrong content config path** — Astro 6 expects `src/content.config.ts`, not `src/content/config.ts` (the v4 location). Using the old path silently fails — no schema validation, no type errors.
- **Tailwind v3 vs v4 confusion** — Tailwind v4 uses CSS-first configuration (`@theme` directive in CSS) instead of `tailwind.config.mjs`. If you install the `@astrojs/tailwind` integration, that's the v3 path. For v4, use `@tailwindcss/vite` plugin. The `npx astro add tailwind` command in Astro 5.2+ handles v4 correctly.
- **Forgetting `site` in astro.config.mjs** — Without `site: 'https://fair.pm'`, `Astro.url` returns localhost URLs in production builds, breaking canonical URLs, OG tags, and sitemap. Set this from day one.
- **Font preload without crossorigin** — `<link rel="preload" as="font">` requires `crossorigin` attribute even for same-origin fonts, or the browser fetches twice. Always include `crossorigin` on font preloads.
- **CSS custom properties in Tailwind v4 @theme** — In v4, map brand tokens via `@theme { --color-green: #25b372; }` inside the CSS file, not a JS config. Use `--font-sans` for font family. The `@theme` values become available as Tailwind utilities (e.g., `text-green`, `bg-green`).
- **Variable font weight range** — Mona Sans is a variable font supporting weights 200-900. In the `@font-face` declaration, set `font-weight: 200 900` to enable all weights. Omitting this limits the browser to weight 400 only.
- **Canonical URL on *.pages.dev** — If `site` is set to `https://fair.pm` but the staging site is on `*.pages.dev`, the canonical URLs will point to fair.pm (correct — prevents duplicate content indexing). But verify this is intentional, not accidental.

## Open Risks

- **Astro Font API maturity** — The Font API was promoted from experimental in Astro 6.0. If the team later wants to migrate from manual `@font-face` to the Font API, it may require config changes. Mitigation: the manual approach is fully stable and doesn't preclude migration.
- **Tailwind v4 breaking changes** — Tailwind v4 is relatively new. Some ecosystem tools (Tailwind CSS IntelliSense, Prettier plugin) may have v4 compatibility gaps. Mitigation: v4 is the recommended path per Astro docs, and the project is new so no v3 migration cost.
- **Mona Sans font file availability** — The font file needs to be downloaded from the live WordPress theme. If the WP site goes down before the font is fetched, the file would be unavailable. Mitigation: download and commit the font file in the first task of S01.
- **SEO component scope creep** — The SEO component is consumed by S02, S03, and S04. If the prop interface changes mid-flight, downstream slices need updates. Mitigation: define the full interface in S01 (even if some props aren't used yet) so the contract is stable.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Astro | `astrolicious/agent-skills@astro` (2.8K installs) | available — recommended install for implementation phase |
| Tailwind CSS | `hairyf/skills@tailwindcss` (963 installs) | available — consider if complex Tailwind patterns emerge |
| Cloudflare Pages | `itechmeat/llm-code@cloudflare-pages` (23 installs) | available — low installs, defer to S05 |
| Frontend design | `frontend-design` | installed — use for S02 visual design work |

## Key Technical Details

### Astro 6.x Content Collections (New Syntax)

Content collections in Astro 6 use `src/content.config.ts` with glob loaders:

```typescript
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().optional(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});

export const collections = { blog };
```

### Tailwind CSS v4 Configuration (CSS-First)

In Tailwind v4, brand tokens are configured in CSS, not JS:

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  --color-green: #25b372;
  --color-orange: #ffaa00;
  --color-red: #970101;
  --color-blue: #0073aa;
  --color-dark-blue: #003d5c;
  --color-light-blue: #66b3d6;
  --color-black: #000;
  --color-white: #fff;
  --color-light-gray: #f6f6f7;
  --color-dark-gray: #565757;

  --font-sans: "Mona Sans", -apple-system, "BlinkMacSystemFont", "Segoe UI",
    "Roboto", "Oxygen-Sans", "Ubuntu", "Cantarell", "Helvetica Neue", sans-serif;
}
```

### SEO Component Interface (S01→S04 Contract)

```typescript
interface Props {
  title: string;
  description: string;            // Required — 120-160 chars
  canonicalURL?: URL;             // Defaults to Astro.url
  ogImage?: string;               // Absolute URL to image
  ogType?: string;                // Defaults to 'website'
  twitterCard?: string;           // Defaults to 'summary_large_image'
  jsonLd?: Record<string, any>;   // Structured data object — S04 extends this
  noindex?: boolean;              // For pages that shouldn't be indexed
}
```

### Astro Config Shape

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://fair.pm',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/packages/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### Nav Structure (from research doc)

```
About FAIR → /about/
  ├── FAIR's Mandate → /about/fairs-mandate/
  ├── FAIR Initiatives → /about/fair-initiatives/
  └── Roadmap → /about/roadmap/
Packages → /packages/ (external — WP origin)
  ├── Plugins → /packages/plugins/
  └── Themes → /packages/themes/
Governance → /governance/
  ├── Technical Steering Committee → /governance/technical-steering-committee/
  ├── Linux Foundation → /governance/linux-foundation/
  ├── Code of Conduct → /governance/code-of-conduct/
  ├── Antitrust Policy → /governance/antitrust-policy/
  ├── Privacy Policy → /governance/privacy-policy/
  └── Terms of Use → /governance/terms-of-use/
Blog → /blog/
Get Involved → /get-involved/
  ├── Join Slack → https://chat.fair.pm (external)
  ├── Join a Meeting → https://zoom-lfx.platform.linuxfoundation.org/... (external)
  └── FAIR Working Groups → /get-involved/fair-working-groups/
Knowledge Base → /fair-knowledge-base/
```

## Requirements Covered

This slice directly supports these requirements:

| Req | Role | What S01 Delivers |
|-----|------|--------------------|
| R001 | supporting | BaseLayout, page structure, Astro project config |
| R002 | supporting | Content collection schema definition, project config |
| R004 | supporting | SEO component with meta/OG/Twitter/canonical/JSON-LD interface |
| R007 | supporting | Skip-to-content slot in BaseLayout, semantic HTML structure, lang attribute |
| R012 | supporting | Tailwind config with brand tokens, Mona Sans font, CSS custom properties |

## Sources

- Astro 6.x Font API is now stable (promoted from experimental) (source: [Astro v6 Upgrade Guide](https://docs.astro.build/en/guides/upgrade-to/v6))
- Content collections in Astro 6 use `src/content.config.ts` with glob loaders and `z` from `astro/zod` (source: [Astro Content Collections Guide](https://docs.astro.build/en/guides/content-collections))
- Tailwind CSS v4 uses `@tailwindcss/vite` plugin with CSS-first `@theme` configuration (source: [Astro Styling Guide - Tailwind](https://docs.astro.build/en/guides/styling))
- `npx astro add tailwind` auto-installs Tailwind v4 via Vite plugin in Astro 5.2+ (source: [Astro Styling Guide](https://docs.astro.build/en/guides/styling))
- Astro Font API with `fontProviders.local()` supports self-hosted variable fonts via config (source: [Astro Font Provider Reference](https://docs.astro.build/en/reference/font-provider-reference))
- `@astrojs/sitemap` supports `filter()` function for excluding specific URL patterns (source: [Astro Sitemap Integration](https://docs.astro.build/en/guides/integrations-guide/sitemap))
- Canonical URLs constructed via `new URL(Astro.url.pathname, Astro.site)` (source: [Astro API Reference](https://docs.astro.build/en/reference/api-reference))
- Mona Sans is MIT-licensed by GitHub, variable font supporting weights 200-900 (source: [github.com/mona-sans](https://github.com/github/mona-sans))
- Astro skill available: `astrolicious/agent-skills@astro` with 2.8K installs (source: [skills.sh](https://skills.sh/astrolicious/agent-skills/astro))
