---
title: "What is FAIR?"
description: "Based on Ryan McCue's LoopConf 2025 talk — why FAIR exists, how it works, and what it means for WordPress and open source package management."
pubDate: "2025-11-04T00:00:00"
author: "admin"
categories:
  - "Uncategorized"
tags:
  - "Community"
draft: false
---

*Based on Ryan McCue’s [presentation](https://docs.google.com/presentation/d/14v5MBXkSUESEobM8WuKwJlr-q_7UcVzJIZ5s_bm7oRw/edit?usp=sharing) at LoopConf 2025*

## Introduction

The WordPress ecosystem stands at a critical juncture. With over 40% of the web running on WordPress, the platform has grown far beyond its humble beginnings. Yet at its core, WordPress still depends on infrastructure controlled by a single entity—and recent events have made it clear that this dependency represents a significant risk to the entire ecosystem.

Enter the [FAIR Project](https://fair.pm/): Federated And Independent Repositories. Announced during [WordCamp Europe 2025](https://europe.wordcamp.org/2025/) at [AltCtrlOrg](https://altctrl.org/) in June, FAIR represents a comprehensive effort to reimagine how WordPress—and indeed any CMS—handles software distribution, updates, and ecosystem management. At [LoopConf 2025](https://www.loopconf.com/), [Ryan McCue](https://rmccue.io/), VP of Product at [Human Made](https://humanmade.com/) and co-chair of [FAIR’s technical steering committee](https://github.com/fairpm/tsc), delivered an in-depth presentation explaining not just what FAIR is, but why it matters and how it works.

## Who is one of the leaders of FAIR.pm?

Before diving into FAIR, it’s worth understanding who’s leading this initiative. [Ryan McCue](https://profiles.wordpress.org/rmccue/) brings over 21 years of experience to the WordPress community—more than two-thirds of his life. His contributions to WordPress are substantial:

- Core committer to WordPress (emeritus)
- Member of the WordPress security team
- Creator and co-lead of the WordPress REST API project
- Creator and original maintainer of Requests for PHP
- Former project lead for SimplePie

This isn’t someone with a passing interest in WordPress. This is someone whose professional identity has been intertwined with WordPress’s success for decades. That context matters when understanding the motivation behind FAIR.

## Why FAIR Exists: The Dependency Problem

WordPress’s architecture includes numerous touchpoints with [wordpress.org](https://wordpress.org/). Most users know about the obvious ones:

- Plugin downloads and updates
- Theme downloads and updates
- WordPress core updates

But FAIR contributors discovered the dependency runs much deeper. WordPress also relies on wordpress.org for:

- PHP version checks
- Browser version checks (via Browse Happy)
- News feeds
- Community event listings
- Block patterns
- Translation updates
- And more

This extensive dependency might seem like a purely technical concern, but it became a critical issue in September 2024 when [legal documents revealed](https://www.courtlistener.com/docket/69221176/wpengine-inc-v-automattic-inc/?filed_after=&filed_before=&entry_gte=&entry_lte=&order_by=desc) a crucial fact: **[wordpress.org](https://wordpress.org/) is [a personal website](https://www.theverge.com/2024/10/4/24262232/matt-mullenweg-wordpress-org-wp-engine)**. It is not part of the WordPress project, not owned by [Automattic](https://automattic.com/), and not controlled by the [WordPress Foundation](https://wordpressfoundation.org/).

As McCue emphasized in his presentation, “WordPress runs 40 something percent of the web. We are at a point where we need to be taking ourselves seriously and we need to have alternatives to depending on a single person and on any single entity.”

## The Hidden Privacy Issues

One of the most striking revelations from FAIR’s technical audit concerns user privacy. Take the browser version checking feature, for example.

The [Browse Happy project](https://browsehappy.com/) has been checking browser versions since before browsers had automatic updates—a genuinely useful service at the time. However, the version checks in WordPress today still reference browser versions from 2016-2017. Internet Explorer 8-11, Chrome 23, and Firefox 18—all discontinued nearly a decade ago.

**The version checks serve no practical purpose anymore.** Yet every time you load your WordPress dashboard, your browser user agent gets sent to wordpress.org. The only purpose this serves is analytics collection by wordpress.org.

As McCue pointed out, “Many people probably don’t know that this data gets collected. I certainly did not realize when I loaded up my WordPress dashboard, my browser user agent was getting sent off to wordpress.org.”

The privacy policy implications are murky at best. The data retention period is unknown. Whether this complies with [GDPR](https://gdpr.eu/) is unclear. And there’s no guarantee that the [public source code](https://github.com/WordPress/browsehappy) actually matches what runs on the server.

## The Ping-O-Matic Revelation

The privacy concerns extend beyond browser checking. WordPress’s ping system, which notifies external services when you publish content, presents another issue.

[Ping-O-Matic](https://pingomatic.com/) appears to be a WordPress Foundation project. It claims to notify search engines about your new content, pinging services like:

- Feed Burner (Google)
- bl.ogs
- Spinn3r
- Superfeedr

Here’s the problem: **Most of these services are defunct.**

FAIR’s team spoke directly with Google, who confirmed that [Feed Burner](https://en.wikipedia.org/wiki/FeedBurner) data is never used anywhere. It’s a discontinued product whose APIs don’t work properly. Spinn3r’s website no longer functions. Superfeedr was acquired and essentially shut down.

That leaves bl.ogs—which is owned by [Automattic](https://automattic.com/).

“Every time you publish a piece of content on your site, it sends a ping off to wordpress.com and to Automattic that says, Hey, I’ve published a piece of content,” McCue explained. “This is extremely valuable data, right? They now have a map of every WordPress site and all the content that’s getting posted everywhere.”

## FAIR’s Solution: Technical Independence

The FAIR Project’s [Technical Independence initiative](https://github.com/fairpm/tsc) aims to replace every wordpress.org dependency with better alternatives. Rather than simply creating one-to-one replacements, FAIR is focused on **improving** the functionality while preserving privacy.

### Better Browser Checking

Instead of sending your browser user agent to a third party, FAIR uses [Browserslist](https://browsersl.ist/)—an industry-standard tool used by Webpack, Babel, and other development frameworks. Browserslist uses real-world data from [Can I Use](https://caniuse.com/) and browser vendors themselves.

The key difference: **checks run entirely on your site**. No data gets sent anywhere. The checks actually work (using current browser versions), and your privacy is preserved. As McCue noted, “We can not just protest something or say we’re gonna build a one-to-one alternative, but we can actually make things better for users.”

### Modern Search Engine Integration

For pings, FAIR replaces the defunct services with [IndexNow](https://www.indexnow.org/)—an open standard created by search engines including Microsoft Bing. When you ping one IndexNow endpoint, it distributes to all participating search engines. It’s decentralized, actually used by search engines, and **genuinely useful**.

### Privacy-Preserving Solutions

The pattern repeats across FAIR’s technical independence work:

- PHP version checks: Talk directly to php.net‘s API instead of wordpress.org
- Emoji: Use common CDNs that users likely have cached
- News and events: Run FAIR’s own APIs (necessary since no one else has this data)
- Browser checks: Run entirely on-site with no external calls

Everything is designed around minimal data collection, preservation of privacy, and use of industry standards wherever possible.

## Rethinking Package Management

The plugin and theme ecosystem represents FAIR’s most ambitious undertaking. The current mental model—that plugins and themes come from wordpress.org—is incomplete. Developers regularly install plugins from:

- GitHub repositories
- Premium plugin vendors
- Private company repositories
- Personal development environments

Each of these sources often includes its own update mechanism. A site with 20 plugins might have 20 different update processes running, each talking to different external services in different ways.

This creates several problems:

### Discovery and Installation

Third-party packages can’t be installed through the WordPress admin interface. Users must find them elsewhere (Google, GitHub, recommendation sites), download them, and manually upload them. This is a poor user experience compared to searching within WordPress and installing directly.

### Developer Inefficiency

Every developer building a premium or private plugin must solve the same problem: how to handle updates. Solutions range from custom-built systems to libraries like [EDD Software Licensing](https://easydigitaldownloads.com/downloads/software-licensing/) or [Git Updater](https://git-updater.com/). It’s inefficient to reinvent this wheel constantly.

### Security and Safety

Plugins hosted on [wordpress.org](https://wordpress.org/) undergo some review and moderation. It was only in late 2025 that automated scans were introduced and reviews were expanded beyond initial submission. For plugins *not* hosted on [wordpress.org](https://wordpress.org/) there is no human review, no automated scanning, and no vulnerability checking other than what the developer does themselves. Users currently install third-party plugins with essentially no safety guarantees.

Even wordpress.org mirrors (increasingly common since September 2024) could theoretically modify packages without detection.

### Policy Restrictions

WordPress.org’s policies prohibit building alternative plugin stores within WordPress itself. While there are understandable safety reasons for this, it leaves users without good options for managing their complete plugin ecosystem.

## FAIR’s Package Management Model

FAIR’s approach draws inspiration from an unlikely source: the web itself.

When you want to visit a website, you don’t ask permission from a central authority. You type the URL and go. But how do you discover new websites? Search engines. Once you know about a site, you access it directly.

FAIR applies this same model to package management:

### Repositories

Anyone can run a repository hosting plugins and themes. This could be:

- GitHub
- A premium plugin vendor
- A company’s internal repository
- The FAIR-operated repository
- A wordpress.org mirror

Repositories are the sources of truth for packages. Sites pull updates directly from repositories, just like your browser talks directly to websites.

### Discovery Aggregators

To solve the discovery problem, FAIR introduces “discovery aggregators”—essentially search engines for packages. These aggregators index available packages across all repositories, making them discoverable to users.

**Multiple discovery aggregators can exist**, just like multiple search engines exist for the web. This prevents any single entity from controlling discoverability while still providing users with the convenience of searching from within WordPress.

[AspireCloud](https://github.com/aspirepress/AspireCloud), which has joined forces with FAIR through [AspirePress](https://aspirepress.org/), serves as the initial discovery aggregator, but anyone can run one.

### Labelers (Moderation Services)

How do you maintain safety in a decentralized system? FAIR borrows from [Bluesky’s approach](https://docs.bsky.app/docs/advanced-guides/moderation) with “[labelers](https://docs.bsky.app/blog/blueskys-moderation-architecture)“—services that apply labels to packages based on various criteria:

- Security scanning results
- Copyright violation checks
- Human moderation reviews
- Platform compatibility
- Code quality assessments

**Multiple labelers can exist**, and users can choose which ones to trust. Your hosting provider might run a labeler indicating platform compatibility. Security firms might run labelers focused on vulnerability detection. The FAIR project will run its own labeler with human review.

Crucially, labelers operate independently of repositories. A developer can’t control what labelers say about their package—just like a hotel can’t control its [TripAdvisor](https://www.tripadvisor.com/) reviews.

### Analytics (Optional)

For understanding package usage, FAIR includes an optional analytics service. This is deliberately separate and non-essential—the entire system works without it. Users can opt out. But it provides valuable data about package popularity, similar to how the [Chrome User Experience Report](https://developer.chrome.com/docs/crux) provides insights about web usage without being essential to the web’s operation.

### Trust and Provenance

To ensure users install the intended package (not an impersonator), FAIR implements multiple trust layers:

- Domain validation: DNS verification confirms package ownership
- Host information: Users can see where packages originate
- Globally unique IDs: Every package has a unique identifier that persists regardless of where it’s hosted
- Future enhancements: A working group is developing additional trust mechanisms

## The Complete System

When fully implemented, FAIR’s architecture looks like this:

1. Your WordPress site connects to multiple services:

– Repositories (for package downloads and updates)    – Discovery aggregators (for finding new packages)    – Labelers (for safety information)    – Analytics (optionally, for usage data)

1. Repositories host packages and serve updates directly to sites
2. Discovery aggregators index packages across all repositories, making them searchable
3. Labelers independently assess and label packages based on their criteria
4. Analytics services collect opt-in usage data

No single entity controls the entire system. Multiple instances of each component can exist. Sites choose which discovery aggregators and labelers to trust. Developers choose where to host their packages.

## Organizational Structure: Ensuring Trustworthiness

Technical architecture alone doesn’t guarantee trustworthiness. FAIR’s organizational structure draws on best practices from successful open source projects, particularly those within the [Linux Foundation](https://www.linuxfoundation.org/).

### The Technical Steering Committee

The [Technical Steering Committee (TSC)](https://github.com/fairpm/tsc) consists of 40+ organizers—people who have made significant technical contributions to FAIR. This includes:

- Code contributors
- Documentation writers
- Website maintainers
- Other technical contributors

TSC members elect three co-chairs who lead the committee and break ties when consensus can’t be reached. The current co-chairs are:

- Ryan McCue
- Mika Epstein
- Carrie Dils

For most decisions, FAIR operates like any open source project: consensus-based, with co-chairs stepping in only when necessary.

### The Governing Board

To handle business needs, FAIR includes a Governing Board that manages:

- Corporate sponsorships
- Funding
- Marketing and outreach
- Event organization
- PR efforts

The Governing Board provides financial support and guidance but is deliberately separated from technical decisions. This prevents any single corporate sponsor from controlling FAIR’s technical direction.

### The Linux Foundation

FAIR operates as the [FAIR Web Foundation within the Linux Foundation](https://www.linuxfoundation.org/press/linux-foundation-announces-the-fair-package-manager-project-for-open-source-content-management-system-stability), borrowing proven organizational models from mature open source projects. This structure separates business concerns from technical decisions while providing the governance and legal framework necessary for a project of FAIR’s scope.

## Current Status and Future Work

FAIR reached version 1.0 in September 2025 (just before LoopConf), marking a significant milestone. However, the team is clear that this is just the beginning of a long journey.

### What’s Available Now

- FAIR plugin (v1.0): Installable on WordPress sites to connect to the FAIR ecosystem
- Mini FAIR Repo: Allows developers to publish their own packages to FAIR
- AspireCloud: The discovery aggregator for finding packages
- AspireExplorer: Web interface for browsing available packages

All projects are open source and available on GitHub at [github.com/FAIRpm](https://github.com/fairpm).

### What’s Coming

- Labeling/moderation services: For package safety and quality assessment
- Analytics service: Optional usage tracking
- Enhanced trust mechanisms: Additional provenance and verification systems
- Better documentation: Ongoing improvement of guides and references
- Composer integration: Making FAIR packages available through Composer
- Additional protocol work: Refinement and expansion of core specifications

### Areas Needing Contributors

FAIR welcomes contributors in numerous areas:

- Moderation and trust: Developing labeling services and trust policies
- Documentation: Creating guides for various audiences and use cases
- Core development: Building out the plugin, AspireCloud, and AspireExplore
- Protocol design: Refining specifications and standards
- Testing and feedback: Using FAIR in real-world scenarios

You can join the community on Slack at chat.FAIR.pm or explore the code on GitHub.

## Why This Matters

FAIR represents more than just technical infrastructure. It’s a philosophical statement about how critical open source ecosystems should operate in 2024 and beyond.

### Independence from Single Points of Failure

When 40%+ of the web depends on infrastructure controlled by one person, that’s a risk too large to ignore. FAIR eliminates this single point of failure while maintaining compatibility with existing WordPress installations.

### Privacy by Design

Rather than collecting data by default and hoping it’s handled responsibly, FAIR minimizes data collection and makes it transparent. Browser checks run locally. Pings go to services that actually use them. Analytics are optional and clearly disclosed.

### Open Competition

By allowing multiple discovery aggregators and labelers to exist, FAIR enables competition and innovation in areas previously locked to a single provider. Better search? Better moderation? Better safety checking? The ecosystem can evolve without permission.

### Learning from the Web

FAIR’s architecture intentionally mirrors the web’s successful model of decentralization. No one controls the web. No one controls which search engine you use. No one controls which websites exist. Yet it all works together through open standards and protocols.

### Beyond WordPress

While FAIR emerged from WordPress community needs, it’s designed for any CMS. [Ghost](https://ghost.org/), [Drupal](https://www.drupal.org/), [Joomla](https://www.joomla.org/)—any platform handling package management could benefit from FAIR’s approach. This is an ecosystem-level solution, not a WordPress-only project.

## Getting Involved

Whether you’re a developer, designer, writer, or concerned community member, FAIR needs your help. The project is in active development with a long road ahead.

- For users: Install the FAIR plugin (version 1.0) on your site. Test it. Provide feedback. Help identify issues and edge cases.
- For developers: Check out the GitHub repositories. Read the discussions. Contribute code, ideas, or documentation. Build integrations.
- For organizations: Consider running your own repository or labeler. Provide feedback on business needs. Contribute to governance discussions.
- For everyone: Join the conversation on Slack. Spread awareness. Help build a more resilient, private, and independent WordPress ecosystem.

## Conclusion

The WordPress ecosystem has thrived for over 20 years, largely thanks to infrastructure provided by wordpress.org. But as McCue noted, “It’s time to grow up.” An ecosystem powering nearly half the web cannot depend on any single entity, no matter how beneficial that entity has been historically.

FAIR doesn’t seek to destroy or replace out of spite. It seeks to improve, to preserve privacy, to enable competition, and to ensure WordPress’s next 20 years are built on a foundation as resilient and decentralized as the web itself.

The work has only just begun. Version 1.0 is a starting point, not a finish line. But with over 40 organizers, growing community support, and a clear technical vision, FAIR is positioning itself to be the infrastructure layer the WordPress ecosystem needs for its future.

As McCue concluded: “I am very invested in this ecosystem and I don’t want to see it go anywhere bad. I don’t want it to collapse or anything like that. So, you know, I’m very invested in making sure that this is a project for the long term.”

The future of WordPress package management is federated, independent, and FAIR.

---

## Resources

- FAIR Website: fair.pm
- Package Explorer: fair.pm/packages
- GitHub: github.com/fairpm
- Slack Community: chat.fair.pm
- Plugin Download: FAIR Plugin Releases
- Mini FAIR Repo: github.com/fairpm/mini-fair-repo
- Technical Steering Committee: github.com/fairpm/tsc
- Get Involved: fair.pm/get-involved
- Linux Foundation Announcement: Linux Foundation Press Release
- AspirePress: aspirepress.org
- Original Presentation: Watch on YouTube

### Additional Context

- WordPress.org Controversy Coverage:

– [The Verge: Matt Mullenweg on WordPress.org ownership](https://www.theverge.com/2024/10/4/24262232/matt-mullenweg-wordpress-org-wp-engine)   – [TechCrunch: WordPress.org bans WP Engine](https://techcrunch.com/2024/09/25/wordpress-org-bans-wp-engine-blocks-it-from-accessing-its-resources/)   – [CNBC: WordPress controversy analysis](https://www.cnbc.com/2024/10/05/wordpress-ceo-matt-mullenweg-goes-nuclear-on-silver-lake-wp-engine-.html)

- FAIR Launch Coverage:

– [Fast Company: WordPress veterans launch FAIR](https://www.fastcompany.com/91347003/wordpress-veterans-launch-fair-project-to-tackle-security-and-control-concerns)   – [The Repository: FAIR to decentralize WordPress](https://www.therepository.email/fair-to-decentralize-wordpress-backed-by-linux-foundation-and-contributors)   – [The Register: Linux Foundation peacemaker](https://www.theregister.com/2025/06/06/linux_foundation_wordpress_peacemaker/)

---

*This post is based on Ryan McCue’s presentation “What’s FAIR is FAIR” delivered at LoopConf 2025.*
