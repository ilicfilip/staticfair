---
id: T03
parent: S04
milestone: M001
provides:
  - Correct heading hierarchy in all blog posts and static pages (no h1 in blog content, no level skips)
  - All blog and static page meta descriptions ≤160 chars and ≥120 chars
key_files:
  - src-astro/src/content/blog/discover-trust-install-fair-1-0-is-here.md
  - src-astro/src/content/blog/fair-connect-1-2-2-release-announcement.md
  - src-astro/src/content/blog/fair-plugin-version-0-4-0-decentralized-installation.md
  - src-astro/src/content/blog/what-is-fair.md
  - src-astro/src/content/blog/2025-fair-recap.md
  - src-astro/src/content/blog/fair-connect-1-2-1-release-announcement.md
  - src-astro/src/pages/rethinking-wordpress-distribution.astro
  - src-astro/src/pages/get-involved/fair-working-groups.astro
key_decisions:
  - Trimmed descriptions preserve core meaning while removing filler words (e.g. "announces its" → "'s", "a comprehensive look at" → removed)
  - Also fixed fair-connect-1-2-1 description (163 chars) not in original plan but required by must-have "all 9 blog descriptions ≤160"
patterns_established:
  - none
observability_surfaces:
  - "Heading check: `grep -c '<h1' dist/blog/*/index.html` — all should show 1"
  - "Description length check: grep frontmatter descriptions and measure with ${#desc}"
duration: ~10 minutes
verification_result: passed
completed_at: 2026-03-27
blocker_discovered: false
---

# T03: Fix heading hierarchy and trim meta descriptions

**Fixed heading hierarchy in 3 blog posts and 1 static page, trimmed 6 descriptions (3 blog + 1 extra blog + 2 static) to ≤160 chars.**

## What Happened

### Heading hierarchy fixes
- `discover-trust-install-fair-1-0-is-here.md` — demoted 4 `# Heading` to `## Heading` (New in this release, Why FAIR 1.0 matters, Acknowledgements, Try FAIR 1.0 today)
- `fair-connect-1-2-2-release-announcement.md` — demoted 1 `# Try FAIR Connect Today` to `##`
- `fair-plugin-version-0-4-0-decentralized-installation.md` — promoted 1 `### Try out 0.4.0` to `##` (was h3 with no preceding h2)
- `rethinking-wordpress-distribution.astro` — changed first `<h3>Aside: what "federated" means</h3>` to `<h2>` (first heading after h1, was skipping a level)

### Description trimming
- `what-is-fair.md`: 190→141 chars
- `2025-fair-recap.md`: 178→156 chars
- `discover-trust-install-fair-1-0-is-here.md`: 176→156 chars
- `fair-connect-1-2-1-release-announcement.md`: 163→154 chars (bonus fix, not in plan)
- `fair-working-groups.astro`: 179→154 chars (updated in both BaseLayout prop and jsonLd)
- `rethinking-wordpress-distribution.astro`: 164→148 chars (updated in both BaseLayout prop and jsonLd)

## Verification

- `npm run build` exits 0 — 26 pages built
- All 9 blog posts have exactly 1 `<h1>` in built HTML (layout-level only)
- No heading-level skips in modified pages (confirmed via grep of built HTML)
- All 9 blog descriptions: 126–156 chars (all ≤160, all ≥120) ✓
- All 17 static page descriptions: 119–153 chars (all ≤160; 16/17 ≥120) ✓
- Slice checks 1–14 all pass (JSON-LD on 26 pages, schema types present, meta tags present, sitemap has 26 URLs, no descriptions over 160, h1 count = 1)

## Diagnostics

- `grep -c '<h1' dist/blog/*/index.html` — should show 1 per post
- `grep -o '<h[1-6][^>]*>' dist/<page>/index.html` — inspect heading hierarchy of any page
- Blog description lengths: `for f in src/content/blog/*.md; do desc=$(grep '^description:' "$f" | sed 's/^description: *"//' | sed 's/"$//'); echo "$(basename $f): ${#desc}"; done`

## Deviations

- Also trimmed `fair-connect-1-2-1-release-announcement.md` description from 163→154 chars. Not in the original plan but required to meet the must-have "All 9 blog post descriptions ≤160 chars."

## Known Issues

- `governance/code-of-conduct.astro` description is 119 chars (1 char under the 120 minimum threshold). Pre-existing; not in scope for this task.

## Files Created/Modified

- `src-astro/src/content/blog/discover-trust-install-fair-1-0-is-here.md` — demoted 4 h1→h2, trimmed description 176→156
- `src-astro/src/content/blog/fair-connect-1-2-2-release-announcement.md` — demoted 1 h1→h2
- `src-astro/src/content/blog/fair-plugin-version-0-4-0-decentralized-installation.md` — promoted 1 h3→h2
- `src-astro/src/content/blog/what-is-fair.md` — trimmed description 190→141
- `src-astro/src/content/blog/2025-fair-recap.md` — trimmed description 178→156
- `src-astro/src/content/blog/fair-connect-1-2-1-release-announcement.md` — trimmed description 163→154
- `src-astro/src/pages/rethinking-wordpress-distribution.astro` — changed first h3→h2, trimmed description 164→148 (both prop + jsonLd)
- `src-astro/src/pages/get-involved/fair-working-groups.astro` — trimmed description 179→154 (both prop + jsonLd)
