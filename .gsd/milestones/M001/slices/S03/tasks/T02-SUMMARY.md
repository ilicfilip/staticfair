---
id: T02
parent: S03
milestone: M001
provides:
  - 6 remaining blog posts migrated with valid Zod frontmatter
  - 5 PNG images downloaded and Astro-optimized (WebP output)
  - 1 MP4 video in public/video/ for direct serving
  - Embed-responsive CSS for 16:9 iframe wrapping (YouTube, SpeakerDeck)
  - Video-responsive CSS for HTML5 video elements
  - All 9 blog posts building and rendering at correct URLs
  - RSS feed containing all 9 blog posts
key_files:
  - src-astro/src/content/blog/what-is-fair.md
  - src-astro/src/content/blog/2025-fair-recap.md
  - src-astro/src/content/blog/discover-trust-install-fair-1-0-is-here.md
  - src-astro/src/content/blog/fair-plugin-version-0-4-0-decentralized-installation.md
  - src-astro/src/content/blog/fair-connect-1-2-2-release-announcement.md
  - src-astro/src/content/blog/second-star-to-the-right-and-straight-on-till-morning.md
  - src-astro/src/styles/global.css
  - src-astro/src/assets/images/blog/
  - src-astro/public/video/fair-plugin-0-4-demo.mp4
key_decisions:
  - "Blog images referenced via relative import paths (../../assets/images/blog/) — enables Astro Image optimization pipeline producing WebP output with srcset"
  - "Video served from public/video/ via HTML5 <video> with controls and aria-label — no build-time processing needed for MP4"
  - "Embed-responsive and video-responsive CSS in global.css using aspect-ratio: 16/9 — modern approach, no padding-top hack"
  - "YouTube iframes use loading='lazy' and allowfullscreen with descriptive title attributes for accessibility"
  - "SpeakerDeck iframe uses protocol-relative URL (//speakerdeck.com/) matching the original embed code"
patterns_established:
  - "YouTube embed pattern: <div class='embed-responsive'><iframe src='https://www.youtube.com/embed/ID' title='Descriptive title' loading='lazy' allowfullscreen></iframe></div>"
  - "Video embed pattern: <div class='video-responsive'><video controls preload='metadata' aria-label='Description'><source src='/video/file.mp4' type='video/mp4' /></video></div>"
  - "Blog image pattern: Markdown ![alt](../../assets/images/blog/filename.png) for Astro Image optimization"
observability_surfaces:
  - "`ls dist/_astro/*.webp` — shows optimized WebP images from Astro pipeline"
  - "`grep 'iframe' dist/blog/what-is-fair/index.html` — confirms YouTube + SpeakerDeck embeds"
  - "`grep '<video' dist/blog/fair-plugin-version-0-4-0-decentralized-installation/index.html` — confirms video element"
  - "`grep -o '<item>' dist/rss.xml | wc -l` — count RSS entries (should be 9)"
  - "Build output shows image optimization count (5 images processed)"
duration: 12m
verification_result: passed
completed_at: 2026-03-27
blocker_discovered: false
---

# T02: Migrate remaining 6 blog posts with images, video, and embeds

**All 9 blog posts now build and render with images optimized to WebP, responsive YouTube/SpeakerDeck embeds, and HTML5 video — completing the blog content migration.**

## What Happened

Downloaded 5 PNG images from GitHub raw URLs to `src/assets/images/blog/`: dashboard-planet.png, combined-package-list-gu.png, avatar-settings.png, planet-zoomed.png, plugin-details-install.png. Downloaded the MP4 demo video to `public/video/fair-plugin-0-4-demo.mp4`.

Added embed-responsive and video-responsive CSS to `global.css` using modern `aspect-ratio: 16/9` for iframe wrappers and full-width responsive video styling.

Converted 6 blog posts from WP REST API HTML to clean Markdown with Zod-valid frontmatter:

1. **fair-connect-1-2-2-release-announcement.md** — Joe Dolson, 2025-12-24. Simple text post with manual update instructions and WP-CLI command.
2. **second-star-to-the-right-and-straight-on-till-morning.md** — FAIR Team, 2026-02-26. Text-only post about project continuity after leadership changes.
3. **fair-plugin-version-0-4-0-decentralized-installation.md** — Siobhan McKeown, 2025-08-20. Contains HTML5 `<video>` element with controls, preload=metadata, and aria-label.
4. **discover-trust-install-fair-1-0-is-here.md** — Courtney Robertson, 2025-09-24. Contains 5 PNG images referenced via relative import paths for Astro optimization. Images render with srcset and WebP format in build output.
5. **2025-fair-recap.md** — Brent Toderash, 2026-01-25. Contains 4 YouTube iframes wrapped in embed-responsive divs with descriptive title attributes and loading=lazy.
6. **what-is-fair.md** — Courtney Robertson, 2025-11-04. The largest post (~31K chars) with 1 YouTube iframe and 1 SpeakerDeck iframe. Converted 39+ headings, numerous lists, and stripped all WP block classes while preserving semantic structure and extensive link references.

All WP block classes stripped, HTML entities decoded, internal links converted to relative paths.

## Verification

All task must-haves verified:

- ✅ `ls src/assets/images/blog/*.png | wc -l` — equals 5
- ✅ `ls public/video/*.mp4 | wc -l` — equals 1
- ✅ Embed-responsive CSS in global.css with aspect-ratio: 16/9
- ✅ All 6 new blog posts created with valid Zod frontmatter (build succeeds)
- ✅ YouTube iframes have `title` attribute and responsive wrapper (verified in what-is-fair and 2025-fair-recap)
- ✅ SpeakerDeck iframe has `title` attribute and responsive wrapper (verified in what-is-fair)
- ✅ Video element has `controls` and `aria-label` (verified in fair-plugin-version-0-4-0)
- ✅ `npm run build` exits 0 — 11 pages built in 769ms
- ✅ `ls dist/blog/*/index.html | wc -l` — equals 9
- ✅ Blog listing shows all 9 post titles (grep confirmed each title)
- ✅ `grep -o '<item>' dist/rss.xml | wc -l` — equals 9
- ✅ `grep -c '<img' dist/blog/discover-trust-install-fair-1-0-is-here/index.html` — 6 img elements (5 content + 1 layout)
- ✅ 5 optimized WebP images in `dist/_astro/`

Slice-level verification (partial — T02 of multi-task slice):

- ✅ `npm run build` exits 0
- ✅ `ls dist/blog/*/index.html | wc -l` equals 9
- ✅ RSS has `<rss>` root element and 9 items
- ✅ Images present in discover post with optimized sources
- ✅ YouTube and SpeakerDeck iframes in what-is-fair
- ✅ Video element in fair-plugin-version-0-4-0
- ✅ Blog listing contains all 9 post titles
- ✅ `ls src/assets/images/blog/*.png | wc -l` equals 5
- ⬜ 28+ pages (11 now — T03/T04 adds 15 static pages)
- ⬜ Static page paths at correct URLs (T03/T04)

## Diagnostics

- `ls dist/blog/*/index.html` — lists all 9 generated blog pages
- `ls dist/_astro/*.webp` — shows 5 optimized WebP images from Astro pipeline
- `grep 'iframe' dist/blog/what-is-fair/index.html` — YouTube + SpeakerDeck embeds present with titles
- `grep -c 'iframe' dist/blog/2025-fair-recap/index.html` — returns 4 (YouTube embeds)
- `grep '<video' dist/blog/fair-plugin-version-0-4-0-decentralized-installation/index.html` — video element with controls
- `grep -o '<item>' dist/rss.xml | wc -l` — count RSS entries (9)
- Build output shows "generating optimized images" section with 5 images processed

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `src-astro/src/styles/global.css` — added embed-responsive (16:9 iframe wrapper) and video-responsive CSS
- `src-astro/src/assets/images/blog/dashboard-planet.png` — downloaded blog image
- `src-astro/src/assets/images/blog/combined-package-list-gu.png` — downloaded blog image
- `src-astro/src/assets/images/blog/avatar-settings.png` — downloaded blog image
- `src-astro/src/assets/images/blog/planet-zoomed.png` — downloaded blog image
- `src-astro/src/assets/images/blog/plugin-details-install.png` — downloaded blog image
- `src-astro/public/video/fair-plugin-0-4-demo.mp4` — downloaded demo video
- `src-astro/src/content/blog/fair-connect-1-2-2-release-announcement.md` — blog post (Joe Dolson)
- `src-astro/src/content/blog/second-star-to-the-right-and-straight-on-till-morning.md` — blog post (FAIR Team)
- `src-astro/src/content/blog/fair-plugin-version-0-4-0-decentralized-installation.md` — blog post with video (Siobhan McKeown)
- `src-astro/src/content/blog/discover-trust-install-fair-1-0-is-here.md` — blog post with 5 images (Courtney Robertson)
- `src-astro/src/content/blog/2025-fair-recap.md` — blog post with 4 YouTube embeds (Brent Toderash)
- `src-astro/src/content/blog/what-is-fair.md` — largest blog post with YouTube + SpeakerDeck embeds (Courtney Robertson)
