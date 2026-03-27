---
title: "2025 FAIR Recap"
description: "From founding under the Linux Foundation to a suite of nine software products — a look back at FAIR's first year of establishing, extending, engaging, and envisioning the future."
pubDate: 2026-01-25
author: "Brent Toderash"
tags:
  - "Community"
---

## Establish.

From discussions early in 2025, FAIR was founded under the [Linux Foundation](https://www.linuxfoundation.org/) and publicly announced at the [AltCtrl.org](https://altctrl.org/) conference in Basel, Switzerland on June 6, 2025. At the event, it was presented shortly after Matt Leach's demonstration of the [AspirePress](https://aspirepress.org/) project to launch a public mirror of the WordPress repository, served by **AspireCloud**, with support by [Fastly](https://www.fastly.com/). A [LF press release](https://www.linuxfoundation.org/press/linux-foundation-announces-the-fair-package-manager-project-for-open-source-content-management-system-stability) was distributed to media outlets for publication at the same time.

Early 2025 involved adopting a governance model, setting objectives, and engaging with the Linux Foundation for oversight and support. In addition to drafting the FAIR Protocol, we prepared the **FAIR Connect** plugin for release at this event as a proof of concept for technical independence. Working closely with AspirePress, the plugin connects to AspireCloud for software updates.

<div class="embed-responsive">
  <iframe src="https://www.youtube.com/embed/HtSn3b_NR1A" title="Matt Leach on Distributing and updating themes & plugins with AspirePress" loading="lazy" allowfullscreen></iframe>
</div>

<div class="embed-responsive">
  <iframe src="https://www.youtube.com/embed/owH0xMGsuCw" title="Ryan, Carrie, Francesca, Joost, Karim & others launch FAIR Federated And Independent Repositories" loading="lazy" allowfullscreen></iframe>
</div>

The announcement was very well-received, with media coverage beyond the WordPress community to the broader tech industry. In the WordPress space, media coverage came from [*The Repository*](https://www.therepository.email/fair-to-decentralize-wordpress-backed-by-linux-foundation-and-contributors), with [a followup on AspirePress](https://www.therepository.email/aspirepress-the-quiet-project-powering-fairs-infrastructure), as well as [*WP-Content.co*](https://wp-content.co/fair-project-linux-foundation-decentralize-wordpress/) and other WordPress news sites as well as blogs and opinion pieces. In the wider tech media, it was covered by outlets like [*Fast Company*](https://www.fastcompany.com/91347003/wordpress-veterans-launch-fair-project-to-tackle-security-and-control-concerns), [*The Register*](https://www.theregister.com/2025/06/06/linux_foundation_wordpress_peacemaker/), [*Search Engine Journal*](https://www.searchenginejournal.com/wordpress-co-founder-mullenwegs-reaction-to-fair-project/548616/), [*Web Hosting Today*](https://webhosting.today/2025/06/07/linux-foundation-launches-fair-project/), [*Silicon Republic*](https://www.siliconrepublic.com/business/wordpress-linux-veterans-restore-trust-fair-project), [*Undercode News*](https://undercodenews.com/fair-package-manager-a-new-era-for-wordpress-plugins-amid-legal-turmoil/), [*Techspot*](https://www.techspot.com/news/108233-linux-foundation-steps-neutral-solution-wordpress-crisis.html), [*Linux Security*](https://linuxsecurity.com/news/security-projects/fair-package-manager-wordpress-stability), [*CMS Critic*](https://cmscritic.com/alls-fair-in-love-and-war-new-fair-package-manager-aims-to-bring-peace-to-the-wordpress-ecosystem), and others.

### What They're Saying

> A game changer. *— Web Hosting Today*

> FAIR's model builds resilience. This move is overdue. *— Brittany Day, Linux Security*

> A New Era for WordPress Enterprise Stability *— Robin Scott*

> Eliminates a major source of enterprise risk. *— Josh Koenig, Pantheon Co-Founder*

> Help[s] to strengthen the software supply chain through greater transparency. *— Robin Bender Ginn, OpenJS Foundation*

Closer to home, the release was reported by FAIR's own [Joost de Valk](https://joost.blog/path-forward-for-wordpress) and [Karim Marucchi](https://marucchi.com/introducing-the-fair-package-manager-for-wordpress/). Shortly after, they gave a brief keynote about the FAIR Project at the Linux Foundation's [Open Source Summit North America](https://events.linuxfoundation.org/archive/2025/open-source-summit-north-america/).

<div class="embed-responsive">
  <iframe src="https://www.youtube.com/embed/mIi2Nib1yh4" title="Keynote: Rebuilding Trust: A FAIR Path Forward for WordPress and Open Source — Karim Marucchi & Joost de Valk" loading="lazy" allowfullscreen></iframe>
</div>

## Extend.

In the midst of all the other efforts during mid-2025, we also launched a basic website. We created and published initial documentation, which we extended to include our moderation spec and began work on a trust model for applying it. Following the initial release announcement, several new projects were initiated or adopted from AspirePress.

We worked on improving **AspireCloud**' search queries and its API, extending it to incorporate some initial FAIR Protocol requirements. This done, we began aggregating several software sources outside of the WordPress.org mirror. These sources are served by **FAIR Beacon**, which we launched mid-year. Meanwhile, FAIR's flagship **Connect** plugin saw ongoing updates, including the addition of WP-CLI support.

As we were shipping more software, we renamed most of them in late 2025 to avoid confusion. By this time, the software suite included:

### FAIR Connect

Formerly "The Fair Plugin", Connect is a WordPress plugin that improves performance and privacy by disconnecting services from wordpress.org, replacing them with local functions or third-party APIs, and serving software updates from AspireCloud.

### FAIR Beacon

Beacon is a WordPress plugin (formerly "Mini-Fair") that creates API endpoints to serve metadata for federated plugins, including package update URIs on Git platforms such as GitHub, GitLab, and Gitea.

### FAIR Explorer

Formerly AspireExplorer, this WordPress plugin provides a publicly browseable and searchable index of available plugins and themes indexed by AspireCloud. See it in action by [exploring packages on fair.pm](https://fair.pm/packages/).

### AspireCloud

AspireCloud will retain its original name to honour the work done by the AspirePress project to launch a public mirror of the software from the official WordPress repository. As a package aggregator, it indexes available software and offers an API for discovering package information and download locations.

### FAIR Forge

Newly launched in late 2025, Forge is itself a suite of tools to be used in reformatting WordPress packages to meet FAIR specifications, and to verify that all federated packages meet minimum standards for security and best practices. In addition to confirming guideline compliance, the tools will be able to gather specific signals used for calculating a trust score for each package FAIR distributes.

## Engage.

Several FAIR developers and advocates made podcast appearances and gave interviews, as well as presentations at a number of events, from local meetups to larger conferences. These include [Ryan McCue's excellent talk at LoopConf](https://fair.pm/blog/what-is-fair/) in September and Brent Toderash's presentation on supply chain security at [WordCamp Canada](https://canada.wordcamp.org/2025/) in October. (Material from that talk is included in our post on [rethinking how WordPress software is distributed](https://fair.pm/rethinking-wordpress-distribution/).)

In November 2025, FAIR partnered with [Patchstack](https://patchstack.com/) in a one-day "hackathon", delivering proofs-of-concept for bringing software vulnerability information directly to WordPress administrators' dashboards. To do this, a **Labeller** was developed to apply specific labels to packages using Patchstack's API for CVE (Common Vulnerabilities and Exposures) reporting. When integrated, searches for packages in the FAIR network can proactively label vulnerable packages. Next, a **Policy Engine** was developed which can enforce a security policy to prevent installing packages with known critical vulnerabilities. This work will soon converge with FAIR Forge to implement FAIR's [Moderation (Labelling) Specification](https://github.com/fairpm/fair-protocol/tree/main/docs/moderation) and apply a robust new **Trust Model**.

The event was an unqualified success. In addition to [CloudFest's own report](https://www.cloudfest.com/blog/building-a-safer-open-web-with-fair-and-patchstack), it was reported on [by *WP-Content.co*](https://wp-content.co/fair-software-security-assistant-cloudfest-usa-2025/) and [by *The Repository*](https://www.therepository.email/fair-and-patchstack-build-security-mvp-at-cloudfest-usa-hackathon). CloudFest media partners were on hand as well, with Mark Szymanski [recording an interview](https://www.therepository.email/fair-and-patchstack-build-security-mvp-at-cloudfest-usa-hackathon) with hackathon project leads Elliot Taylor (Patchstack), Carrie Dils (FAIR TSC Co-Chair), and Brent Toderash (FAIR TSC).

<div class="embed-responsive">
  <iframe src="https://www.youtube.com/embed/EY9bVcQL5NA" title="How FAIR and Patchstack Are Building a Safer WordPress Future | CloudFest USA Hackathon 2025 Recap" loading="lazy" allowfullscreen></iframe>
</div>

## Envision.

2025 ended on a high note for FAIR. A scant six months from its public announcement, FAIR has been represented at many regional and global events. FAIR Connect went through a number of releases during that time, with a number of other software and documentation projects being picked up in the process. By the time the year ended, the FAIR TSC had adopted a [planned release cadence](https://github.com/fairpm/tsc/blob/main/process/release-calendar.md) and [roadmap for 2026](https://fair.pm/about/roadmap/), which promises more major steps on the road to federated software distribution.

One year on, FAIR has gone from a conceptual discussion to a suite of at least nine software products in active development with project contributors in time zones all around the globe.
