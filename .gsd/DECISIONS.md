# Decisions Register

<!-- Append-only. Never edit or remove existing rows.
     To reverse a decision, add a new row that supersedes it.
     Read this file at the start of any planning or research phase. -->

| # | When | Scope | Decision | Choice | Rationale | Revisable? |
|---|------|-------|----------|--------|-----------|------------|
| D001 | M001 | arch | Static site framework | Astro (static output, TypeScript) | Content-heavy, mostly static site. Astro ships zero JS by default, has content collections, built-in image optimization | No |
| D002 | M001 | arch | CSS approach | Tailwind CSS with CSS custom properties for brand tokens | Light refresh with modern utility-first framework. Custom properties allow brand token changes without rebuilding | No |
| D003 | M001 | arch | Font | Mona Sans (self-hosted variable font) | Carries forward from current WP theme. Open source (MIT, GitHub). Variable font = single file for all weights | No |
| D004 | M001 | arch | Deployment target | Cloudflare Pages (pure static, no SSR adapter) | No dynamic features needed after excluding packages. Static output simplest to deploy and cache | Yes — if future feature requires SSR |
| D005 | M001 | scope | /packages/* handling | Excluded from Astro site. Served by standalone WP install via Cloudflare origin routing | Package explorer is most complex piece. Separate origin allows independent lifecycle | No |
| D006 | M001 | arch | Content repository strategy | Single repo (code + content together) | Simpler deploys, no sync issues. Content structure abstracted enough to split later | Yes — if content governance needs separation |
| D007 | M001 | arch | Content workflow | GitHub PRs, auto-deploy on merge to main | All contributors are technical. No CMS needed now | Yes — if non-technical editors join |
| D008 | M001 | arch | Blog content source | WordPress REST API extraction (one-time) | API is publicly accessible, returns full HTML content. Cleaner than WXR export parsing | No |
| D009 | M001 | scope | Branding | Placeholder text logo + favicon (designed for easy replacement) | Real branding hasn't been decided yet. Placeholders unblock launch | Yes — when brand decisions are made |
| D010 | M001 | convention | Blog URL structure | /blog/[slug]/ (drop date segments from WordPress URLs) | Cleaner URLs, better for sharing. Dates shown in post metadata, not URL. All old URLs get 301 redirects | No |
