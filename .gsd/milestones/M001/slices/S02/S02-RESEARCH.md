# S02: Design Refresh & Accessibility — Research

**Date:** 2026-03-27

## Summary

S02 owns R007 (Accessibility/WCAG AA), R009 (Responsive design), R012 (Design refresh), and R013 (Placeholder branding). The slice takes the unstyled semantic skeletons from S01 (Header, Footer, BaseLayout, homepage) and applies the full visual design: WCAG AA-compliant color palette, responsive navigation with mobile hamburger menu, styled header/footer, visible focus indicators, and placeholder logo/favicon.

The critical color finding is that the brand green `#25b372` fails WCAG AA on white (2.70:1). The recommended replacement is **`#1a7f53`** (4.99:1 on white, 4.62:1 on light-gray) — same hue (152.5°), just darker. Orange (`#ffaa00`, 1.91:1) and light-blue (`#66b3d6`, 2.34:1) also fail AA for text and must be restricted to decorative/non-text use only.

The mobile navigation requires minimal JavaScript — a `<script>` tag in Header.astro to toggle `aria-expanded` on the hamburger button and show/hide the menu. This is Astro's standard pattern for interactive components that don't need framework hydration. No React/Vue/Svelte integration needed.

## Recommendation

**Approach:** Style the existing S01 components in-place using Tailwind CSS utility classes. The work splits naturally into: (1) color token adjustments in `global.css`, (2) Header.astro restyling with responsive nav + minimal JS, (3) Footer.astro restyling, (4) homepage section styling, (5) placeholder logo SVG + favicon, (6) global focus indicators and accessibility audit.

**Design direction:** Follow the existing WP theme's design language — blue header bar (`#0073aa`), dark blue for headings (`#003d5c`), white content areas, light-gray section backgrounds. This is a "light refresh" per the requirements, not a full redesign. The frontend-design skill should be loaded during execution for polish, but aesthetic decisions must stay within the brand constraints.

**Mobile nav pattern:** Hamburger button with `<script>` tag in Header.astro. No framework needed. The button toggles `aria-expanded`, shows/hides the `<ul>` menu, and manages focus. Dropdown sub-menus use `<details>/<summary>` or button toggles with the same pattern.

**Verification:** Lighthouse accessibility audit (target ≥90), manual keyboard navigation test in browser, contrast ratio checks on all text/background combinations.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Color contrast validation | Python calculation (done in research) | All ratios pre-computed; just use the recommended values |
| Focus indicators | Tailwind `focus-visible:` variant + `ring` utilities | Built-in, consistent, handles high-contrast mode |
| Screen reader only text | Tailwind `sr-only` / `not-sr-only` | Already used in S01 for skip link and external link indicators |
| SVG favicon generation | Hand-coded SVG with FAIR initials | Simple enough; no tool needed for a text-based placeholder |

## Existing Code and Patterns

- `src-astro/src/layouts/BaseLayout.astro` — HTML shell with skip-to-content link, font preload, SEO pass-through. S02 doesn't modify this except possibly adding a global focus style.
- `src-astro/src/components/Header.astro` — Semantic nav skeleton with full link hierarchy. S02 adds all Tailwind classes, responsive behavior, hamburger button, dropdown toggles, and a `<script>` for mobile menu.
- `src-astro/src/components/Footer.astro` — Semantic footer with links and copyright. S02 adds Tailwind styling (dark-blue background, white text, link grid).
- `src-astro/src/pages/index.astro` — Homepage with basic Tailwind classes. S02 expands with hero section, CTA cards, feature list styling.
- `src-astro/src/styles/global.css` — Tailwind v4 `@theme` block with brand color tokens. S02 updates the green token and adds any needed global base styles (focus rings, link defaults).
- `public/fonts/monasansvf.woff2` — Mona Sans variable font (262KB). No changes needed.

### Patterns established by S01 to follow:
- Tailwind v4 CSS-first config via `@theme` directive — all token changes go in `global.css`
- `BaseLayout → SEO component` props pass-through — no changes to this pattern
- External links use `rel="noopener noreferrer" target="_blank"` with `<span class="sr-only"> (external link)</span>`
- Semantic ARIA landmarks: `<header>`, `<nav aria-label="Main">`, `<main id="main-content">`, `<footer>`, `<nav aria-label="Footer">`

## Constraints

- **Tailwind v4 CSS-first config** — Color tokens live in `@theme {}` in `global.css`, not a JS config file. No `tailwind.config.mjs` exists (D011).
- **Zero-JS default** — Astro ships no client JS unless explicitly added. The mobile menu toggle is the only JS needed — use a `<script>` tag in Header.astro (not a framework component).
- **Mona Sans only** — Single font family per D003. Variable weights 200-900 available. Use weight variation for hierarchy (400 body, 600 semibold, 700 bold headings).
- **Placeholder branding** — Logo must be a clean text wordmark, not a complex graphic. Favicon must be simple. Both designed for easy replacement (D009).
- **No content changes** — S02 styles existing markup. Homepage content stays as-is (real content comes in S03). The homepage should look good with its current placeholder content.
- **S01 inline @font-face** — Must not remove the `<style is:inline>` block in BaseLayout (D015). It's needed for both V3 verification and critical font loading.

## Color Contrast Matrix

### Adjusted Palette

| Token | Current | Adjusted | Change Reason |
|-------|---------|----------|---------------|
| `--color-green` | `#25b372` | **`#1a7f53`** | Fails AA on white (2.70:1). Adjusted to 4.99:1 on white, 4.62:1 on light-gray. Same hue (152.5°). |
| All others | unchanged | unchanged | Pass AA in their intended pairings |

### Full Contrast Verification

All text/background combinations that will be used in the design:

| Combination | Ratio | AA Normal (4.5:1) | AA Large (3:1) |
|-------------|-------|-------------------|----------------|
| dark-gray `#565757` on white `#fff` | 7.25:1 | ✓ | ✓ |
| dark-blue `#003d5c` on white `#fff` | 11.53:1 | ✓ | ✓ |
| green `#1a7f53` on white `#fff` | 4.99:1 | ✓ | ✓ |
| blue `#0073aa` on white `#fff` | 5.21:1 | ✓ | ✓ |
| dark-gray `#565757` on light-gray `#f6f6f7` | 6.71:1 | ✓ | ✓ |
| dark-blue `#003d5c` on light-gray `#f6f6f7` | 10.67:1 | ✓ | ✓ |
| green `#1a7f53` on light-gray `#f6f6f7` | 4.62:1 | ✓ | ✓ |
| white `#fff` on dark-blue `#003d5c` | 11.53:1 | ✓ | ✓ |
| white `#fff` on blue `#0073aa` | 5.21:1 | ✓ | ✓ |
| white `#fff` on green `#1a7f53` | 4.99:1 | ✓ | ✓ |

### Colors restricted to non-text / decorative use only

| Color | Hex | Ratio on White | Usage |
|-------|-----|---------------|-------|
| orange | `#ffaa00` | 1.91:1 | Accent backgrounds, icons, badges — never as text on white |
| light-blue | `#66b3d6` | 2.34:1 | Decorative borders, accent backgrounds — never as text on white |
| green (original) | `#25b372` | 2.70:1 | **Retired** — replaced by `#1a7f53` everywhere |

## Common Pitfalls

- **Focus indicators invisible on colored backgrounds** — The default Tailwind `focus-visible:ring-2 ring-blue-500` may not be visible on the dark-blue header. Use `ring-white` or `ring-offset` on dark backgrounds. Test focus on every interactive element in both light and dark sections.
- **Mobile menu closes on sub-menu click** — If the hamburger toggle closes the entire menu when any link is clicked, sub-menu navigation breaks. The toggle should only fire on the hamburger button, not on nav links.
- **`aria-expanded` out of sync** — The hamburger button's `aria-expanded` attribute must accurately reflect menu visibility state. If CSS transitions are used, the ARIA state should change immediately (not after transition).
- **Dropdown menus inaccessible by keyboard** — Sub-menu items must be reachable via Tab/Arrow keys. Either use native `<details>/<summary>` (which handles this for free) or implement keyboard handlers.
- **Skip-to-content link not visible on focus** — Already implemented in S01 with `sr-only focus:not-sr-only`, but verify it actually appears above the header when focused, especially after header styling changes the stacking context.
- **Orange text used for links/CTAs** — The current WP site uses orange for Download buttons (white text on orange background). This needs careful handling — white on `#ffaa00` is only 1.91:1 (fails). Use dark text on orange, or avoid orange backgrounds for text entirely.
- **Light-gray sections with green text** — Green on light-gray (4.62:1) passes AA but is close to the threshold. If any section uses a gray darker than `#f6f6f7`, re-check the ratio.

## Open Risks

- **Hamburger menu JS robustness** — The `<script>` tag in Astro components runs once on page load. If Astro's view transitions are later enabled (not in scope now), the script may not re-run on navigation. This is fine for S02 but could need attention if view transitions are added later.
- **Sub-menu interaction pattern choice** — `<details>/<summary>` is simplest (no JS for dropdowns) but has inconsistent animation support and may not match the desired visual feel. Button-based toggles give more control but require JS for each dropdown. Recommendation: use `<details>/<summary>` for mobile sub-menus, hover-based reveal for desktop (CSS-only with `:hover` and `:focus-within`).
- **Lighthouse ≥90 on accessibility with no content** — The homepage currently has minimal placeholder content. Lighthouse may flag issues like "Document doesn't have a meta description" on pages that don't exist yet, but those are S03 concerns. S02 targets ≥90 on the homepage specifically.

## Design Reference (from live WP site)

### Header Design
- **Linux Foundation banner:** Dark bar (`#232323`) at very top with LF logo. This is a branding requirement for LF projects — include it as a simple dark strip with "A Linux Foundation Project" text and link.
- **Main header:** Blue background (`#0073aa`) with white text. Site name "FAIR" on left, "Federated and Independent Repositories" subtitle below. Nav links on right.
- **Nav links:** White on blue, underline on hover, `outline: 2px solid; outline-offset: 6px` on focus. Dropdown sub-menus have white background with box-shadow.
- **Mobile:** Hamburger button labeled "Menu" replaces nav links below ~1030px breakpoint.

### Footer Design
- **Background:** Dark-blue (`#003d5c`) with white text.
- **Content:** WordPress logo (replace with FAIR text), copyright notice, "Hosted by the Linux Foundation" with link, then four footer nav links (Code of Conduct, Antitrust Policy, Privacy Policy, Terms of Use).
- **Back-to-top button** in bottom-right corner.

### Homepage Sections
1. Hero: Full-width light gray background, large introductory text
2. Featured release: Dark blue card with product screenshots
3. Package explorer CTAs: Two side-by-side cards linking to plugins/themes
4. "FAIR is:" bulleted list
5. Six CTA cards in 3×2 grid using brand colors as backgrounds (red, dark-blue, teal, orange, blue, light-blue)

### Typography (from WP theme)
- Body: 18px (1.125rem), weight 400, line-height 1.7
- H1: 2.5rem, weight 700, line-height 1.2
- H2: 1.875rem, weight 700
- H3: 1.5rem, weight 700
- H4: 1.25rem, weight 700
- Mobile scales: H1→2rem, H2→1.5rem, H3→1.33rem, body→1rem

## Accessibility Checklist (from WCAG AA requirements)

- [ ] All text/background color combinations meet 4.5:1 (normal) or 3:1 (large text)
- [ ] Skip-to-content link visible on focus and works
- [ ] All interactive elements have visible focus indicators
- [ ] Focus indicators visible on both light and dark backgrounds
- [ ] Hamburger button has `aria-expanded` and `aria-controls`
- [ ] Mobile menu is keyboard-navigable (Tab, Escape to close)
- [ ] `prefers-reduced-motion` respected (no animations if set)
- [ ] All images have alt text (placeholder logo SVG needs accessible name)
- [ ] No color used as the sole means of conveying information
- [ ] Correct heading hierarchy (single H1, no skipped levels)
- [ ] Lang attribute on HTML (already present from S01)
- [ ] ARIA landmarks present (already from S01: header, nav, main, footer)

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Frontend design | `frontend-design` | **Installed** — load during execution for styling polish |
| Tailwind CSS | (search timed out) | Use Context7 docs instead |
| Astro | (no specific a11y skill) | Use Context7 docs |
| WCAG/Accessibility | (no specific skill) | Manual implementation per WCAG guidelines |

## Sources

- All brand color contrast ratios computed via WCAG 2.0 relative luminance formula (Python calculation during research)
- Live WP theme CSS: `https://fair.pm/content/themes/fair-parent-theme/style.css` — color tokens, hover/focus styles, layout patterns
- Live WP theme global CSS: `https://fair.pm/content/themes/fair-parent-theme/css/dev/global.css` — typography tokens, spacing, responsive breakpoints, focus styles, screen-reader-text class
- Live site visual inspection (desktop + mobile screenshots) — header, footer, homepage layout, mobile hamburger menu
- Tailwind CSS v4 docs via Context7 — `focus-visible:` variant, `ring` utilities, outline handling
- Astro docs via Context7 — `<script>` tag pattern for client-side interactivity, client directives (not needed for this slice)
- S01 summary — established patterns, key files, forward intelligence
