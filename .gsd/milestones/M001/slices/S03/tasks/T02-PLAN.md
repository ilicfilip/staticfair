---
estimated_steps: 5
estimated_files: 10
---

# T02: Migrate remaining 6 blog posts with images, video, and embeds

**Slice:** S03 — Content Migration
**Milestone:** M001

## Description

Completes the blog content migration by converting the remaining 6 blog posts, including the most complex ones. Downloads 5 PNG images from GitHub to `src/assets/images/blog/` for Astro Image optimization. Downloads the GitHub-hosted MP4 video to `public/video/`. Converts YouTube iframes (5 across 2 posts), SpeakerDeck iframe (1 post), and the GitHub video embed into accessible, responsive elements. The `what-is-fair` post (31K chars) is the most complex conversion target. Adds embed-responsive CSS to global.css.

## Steps

1. Create `src/assets/images/blog/` directory. Download 5 PNG images from GitHub raw URLs (dashboard-planet.png, combined-package-list-gu.png, avatar-settings.png, planet-zoomed.png, plugin-details-install.png). Create `public/video/` directory and download the GitHub MP4 video.
2. Add embed-responsive CSS to `src/styles/global.css` — a `.embed-responsive` class with 16:9 aspect ratio wrapper for YouTube and SpeakerDeck iframes. Ensure iframes within it are full-width and properly sized.
3. Convert and create `fair-connect-1-2-2-release-announcement.md` (simple text, Joe Dolson) and `second-star-to-the-right-and-straight-on-till-morning.md` (text-only, FAIR Team) — straightforward conversions.
4. Convert and create the media-rich posts:
   - `fair-plugin-version-0-4-0-decentralized-installation.md` — contains GitHub video. Use raw HTML `<video>` element with controls, responsive wrapper, and accessible alt text. Reference video from `/video/` public path.
   - `discover-trust-install-fair-1-0-is-here.md` — contains 5 PNG images. Reference images using Markdown `![alt](/images/blog/filename.png)` syntax or HTML `<img>` with appropriate alt text. Images in `src/assets/images/blog/` need to be referenced in a way Astro can optimize them.
   - `2025-fair-recap.md` — contains 4 YouTube iframes. Wrap each in `<div class="embed-responsive">` with `<iframe>` having `title`, `allowfullscreen`, and `loading="lazy"`.
5. Convert `what-is-fair.md` — the largest post (31K chars) with 1 YouTube iframe and 1 SpeakerDeck iframe. Carefully convert 39 headings, 22 lists, and strip 69 WP block class instances while preserving semantic structure. Embed YouTube and SpeakerDeck with responsive wrappers and accessible `title` attributes.

## Must-Haves

- [ ] 5 PNG images downloaded to `src/assets/images/blog/`
- [ ] 1 MP4 video downloaded to `public/video/`
- [ ] Embed-responsive CSS in global.css for 16:9 iframe wrapping
- [ ] All 6 remaining blog posts created with valid Zod frontmatter
- [ ] YouTube iframes have `title` attribute and responsive wrapper
- [ ] SpeakerDeck iframe has `title` attribute and responsive wrapper
- [ ] Video element has `controls` and descriptive text
- [ ] Build succeeds with all 9 blog posts generating pages
- [ ] Blog listing shows all 9 posts sorted by date

## Verification

- `cd src-astro && npm run build` exits 0
- `ls dist/blog/*/index.html | wc -l` — equals 9
- `ls src/assets/images/blog/*.png | wc -l` — equals 5
- `ls public/video/*.mp4 | wc -l` — equals 1
- `grep 'iframe' dist/blog/what-is-fair/index.html` — YouTube + SpeakerDeck embeds present
- `grep 'iframe' dist/blog/2025-fair-recap/index.html` — 4 YouTube embeds present
- `grep '<video' dist/blog/fair-plugin-version-0-4-0-decentralized-installation/index.html` — video element present
- `grep -c '<item>' dist/rss.xml` — equals 9 (all posts in RSS)
- Blog listing `dist/blog/index.html` contains all 9 post titles

## Observability Impact

- Signals added/changed: Image optimization logs during build (Astro shows processed image count). Missing image references → build error with file path.
- How a future agent inspects this: `ls dist/_astro/` shows optimized image files (WebP/AVIF). `grep 'img' dist/blog/discover-trust-install-fair-1-0-is-here/index.html` shows image elements with srcset.
- Failure state exposed: Missing image file → Astro build error with import path. Malformed frontmatter → Zod error with field name.

## Inputs

- `src-astro/src/content/blog/` — 3 existing blog posts from T01 (proves pipeline works)
- `src-astro/src/layouts/BlogPost.astro` — blog post layout from T01
- `src-astro/src/pages/blog/index.astro` — blog listing from T01
- WP REST API `https://fair.pm/wp-json/wp/v2/posts` — source for blog post HTML content
- GitHub raw URLs for images: `https://raw.githubusercontent.com/developer-starter-packages/starter-packages/main/assets/release-1.0/` — 5 PNG files
- GitHub video URL: `https://github.com/user-attachments/assets/7c887400-839a-43ee-85dd-570fcb3bd031`

## Expected Output

- `src-astro/src/assets/images/blog/dashboard-planet.png` — downloaded image
- `src-astro/src/assets/images/blog/combined-package-list-gu.png` — downloaded image
- `src-astro/src/assets/images/blog/avatar-settings.png` — downloaded image
- `src-astro/src/assets/images/blog/planet-zoomed.png` — downloaded image
- `src-astro/src/assets/images/blog/plugin-details-install.png` — downloaded image
- `src-astro/public/video/fair-plugin-0-4-demo.mp4` — downloaded video
- `src-astro/src/content/blog/fair-connect-1-2-2-release-announcement.md` — blog post
- `src-astro/src/content/blog/fair-plugin-version-0-4-0-decentralized-installation.md` — blog post with video
- `src-astro/src/content/blog/discover-trust-install-fair-1-0-is-here.md` — blog post with images
- `src-astro/src/content/blog/what-is-fair.md` — largest blog post with YouTube + SpeakerDeck embeds
- `src-astro/src/content/blog/2025-fair-recap.md` — blog post with 4 YouTube embeds
- `src-astro/src/content/blog/second-star-to-the-right-and-straight-on-till-morning.md` — blog post
- `src-astro/src/styles/global.css` — embed-responsive CSS added
