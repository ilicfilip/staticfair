---
estimated_steps: 4
estimated_files: 7
---

# T03: Fix heading hierarchy and trim meta descriptions

**Slice:** S04 — SEO & Structured Data
**Milestone:** M001

## Description

Content corrections for SEO and accessibility. Fix heading hierarchy violations in 3 blog posts and 1 static page (h1→h2 or h3→h2 demotions). Trim 3 blog post descriptions and 2 static page descriptions that exceed 160 characters. These are direct content edits — no template or component changes.

## Steps

1. Fix heading hierarchy in blog posts:
   - `discover-trust-install-fair-1-0-is-here.md` — change 4 `# Heading` to `## Heading` (lines 23, 67, 79, 87: "New in this release", "Why FAIR 1.0 matters", "Acknowledgements", "Try FAIR 1.0 today")
   - `fair-connect-1-2-2-release-announcement.md` — change 1 `# Try FAIR Connect Today` to `## Try FAIR Connect Today` (line 29)
   - `fair-plugin-version-0-4-0-decentralized-installation.md` — change `### Try out 0.4.0` to `## Try out 0.4.0` (line 14, h3→h2 since no preceding h2)

2. Fix heading hierarchy in static page:
   - `rethinking-wordpress-distribution.astro` — change first `<h3>Aside: what "federated" means</h3>` to `<h2>` (line 19). This is inside an `<aside>`, and it's the first heading after the `<h1>`. It should be `<h2>` to avoid skipping a level. The other `<h3>` tags under `<h2 id="problems">` are correct as they're sub-headings.

3. Trim blog post descriptions to ≤160 chars:
   - `what-is-fair.md` (190→≤160): Shorten while preserving meaning. Current: "Based on Ryan McCue's presentation at LoopConf 2025 — a comprehensive look at why FAIR exists, how it works, and what it means for the future of WordPress and open source package management." Target: ~155 chars.
   - `2025-fair-recap.md` (178→≤160): Shorten. Current: "From founding under the Linux Foundation to a suite of nine software products — a look back at FAIR's first year of establishing, extending, engaging, and envisioning the future." Target: ~155 chars.
   - `discover-trust-install-fair-1-0-is-here.md` (176→≤160): Shorten. Current: "Decentralised WordPress packages are here. FAIR announces its 1.0 Milestone Release, enabling site administrators to find, trust, and install packages from independent sources." Target: ~155 chars.

4. Trim static page descriptions to ≤160 chars:
   - `get-involved/fair-working-groups.astro` (179→≤160): Shorten. Current: "Overview of FAIR's active and archived Working Groups organized under the Technical Steering Committee, including AspireCloud, Community, FAIR, Infrastructure, and Website groups." Target: ~155 chars.
   - `rethinking-wordpress-distribution.astro` (164→≤160): Minor trim. Current: "FAIR — Federated and Independent Repositories — is rethinking the WordPress distribution model with a decentralized, verifiable, and community-governed alternative." Target: ~155 chars.

## Must-Haves

- [ ] Zero `<h1>` tags in blog post content (only the layout-level h1 for the post title)
- [ ] No heading level skips (h1→h3) in any page
- [ ] All 9 blog post descriptions ≤160 chars and ≥120 chars
- [ ] All 17 static page descriptions ≤160 chars and ≥120 chars (homepage already at 134)
- [ ] Trimmed descriptions still accurately describe page content

## Verification

- `cd src-astro && npm run build` exits 0
- Heading checks:
  - `grep -c '<h1' dist/blog/discover-trust-install-fair-1-0-is-here/index.html` = 1 (only layout h1)
  - `grep -c '<h1' dist/blog/fair-connect-1-2-2-release-announcement/index.html` = 1
  - `grep -c '<h1' dist/blog/fair-plugin-version-0-4-0-decentralized-installation/index.html` = 1
- Description length check:
  - All blog frontmatter descriptions ≤160 chars (checked via shell loop)
  - All static page description props ≤160 chars (checked via grep + wc)
- Blog listing still shows all 9 posts (descriptions used as excerpts — verify they still read well)

## Observability Impact

- Signals added/changed: None (content corrections only)
- How a future agent inspects this: `grep -c '<h1' dist/blog/*/index.html` should show 1 for every post. Description lengths checked via frontmatter grep.
- Failure state exposed: None

## Inputs

- `src-astro/src/content/blog/discover-trust-install-fair-1-0-is-here.md` — 4 h1 headings in content to demote
- `src-astro/src/content/blog/fair-connect-1-2-2-release-announcement.md` — 1 h1 heading to demote
- `src-astro/src/content/blog/fair-plugin-version-0-4-0-decentralized-installation.md` — 1 h3 heading to promote to h2
- `src-astro/src/pages/rethinking-wordpress-distribution.astro` — first content h3 should be h2
- `src-astro/src/content/blog/what-is-fair.md` — description 190 chars, needs trimming
- `src-astro/src/content/blog/2025-fair-recap.md` — description 178 chars, needs trimming
- `src-astro/src/content/blog/discover-trust-install-fair-1-0-is-here.md` — description 176 chars, needs trimming
- `src-astro/src/pages/get-involved/fair-working-groups.astro` — description 179 chars, needs trimming
- `src-astro/src/pages/rethinking-wordpress-distribution.astro` — description 164 chars, needs trimming

## Expected Output

- 3 blog Markdown files modified with correct heading levels
- 1 static `.astro` page modified with correct heading level
- 3 blog Markdown files with trimmed descriptions
- 2 static `.astro` pages with trimmed descriptions
- Build output has exactly 1 `<h1>` per blog post page and no heading-level skips
