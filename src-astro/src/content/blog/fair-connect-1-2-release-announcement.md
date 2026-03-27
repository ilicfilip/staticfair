---
title: "FAIR Connect 1.2 Release Announcement"
description: "FAIR Plugin gets a new name — FAIR Connect! Version 1.2 brings improved compatibility, better performance, and naming updates across the FAIR ecosystem."
pubDate: 2025-12-11
author: "Colin Stewart"
tags:
  - "Release Notes"
---

With our newest release, 1.2, FAIR Plugin gets a new name; FAIR Connect!

This release also has some feature refinements and fixes for you. As always, thanks to our amazing contributors.

P.S. Still getting your head around FAIR? Check out [our explainer video and post](/blog/what-is-fair/)!

## What's New in 1.2

### New Name, Same Plugin

FAIR Plugin is now FAIR Connect. This is one of several name changes across FAIR, aimed to help clarify what each part of the project does. ([#351](https://github.com/fairpm/fair-plugin/pull/351), [#352](https://github.com/fairpm/fair-plugin/pull/352))

Other changes include:

- Mini FAIR -> FAIR Beacon – Make your packages available to the FAIR network.
- AspireExplore -> FAIR Explorer – Explore packages in the FAIR network.

### Improved Compatibility

- **Improved Avatar Handling**: Custom avatars are now supported when Gravatar is enabled. ([#349](https://github.com/fairpm/fair-plugin/pull/349))
- **Updated Browser List**: The browser compatibility feature now includes an updated browser list to provide more accurate compatibility warnings. ([#325](https://github.com/fairpm/fair-plugin/pull/325))

### More Performant and Stable

- **IndexNow requests** are now handled earlier to bypass unneeded database queries. ([#317](https://github.com/fairpm/fair-plugin/pull/317))
- **IndexNow notifications** are now skipped during imports. ([#319](https://github.com/fairpm/fair-plugin/pull/319))

## Upgrade Notes

This is a feature release that maintains backward compatibility with version 1.1. All users are encouraged to upgrade to take advantage of these improvements.

## Try FAIR 1.2 today

Ready to explore FAIR?

- **Install the FAIR Connect** [release ZIP](https://github.com/fairpm/fair-plugin/releases/download/1.2.0/fair-plugin-1.2.0.zip) to search for verified plugins from both official and independent sources.
- **Browse packages** at [fair.pm/packages](https://fair.pm/packages)
- **Publish your own plugin** using [FAIR Beacon](https://github.com/fairpm/fair-beacon)
- **Find us on GitHub** as [FAIRPM](https://github.com/fairpm/)
- **Join the conversation** by [getting involved](https://fair.pm/get-involved/) in our [Slack](https://chat.fair.pm/) or [GitHub Discussions](https://github.com/orgs/fairpm/discussions)

If you're a developer, publisher, or simply curious, we'd love to hear your thoughts.
