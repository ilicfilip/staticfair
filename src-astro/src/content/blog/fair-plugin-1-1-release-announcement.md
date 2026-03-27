---
title: "FAIR Plugin 1.1 Release Announcement"
description: "Introducing FAIR 1.1 with WP-CLI plugin support, improved user experience, better compatibility, and updated FAIR identifiers."
pubDate: 2025-11-09
author: "Colin Stewart"
tags:
  - "Release Notes"
---

Introducing FAIR 1.1, our newest release as part of our regular 6-week release train. We've got some great new features, as well as refinements of existing ones.

One of the big features we've included in 1.1 is WP-CLI support for plugins, making it possible to manage plugins directly from the command line using their DID. We've heard from a lot of people that they'd love to be able to manage FAIR-distributed plugins using the CLI – and now you can!

We've also improved consistency and accuracy with a few parts of our user interface, helping to clarify the experience for everyone.

All of this, plus loads of other fixes below – as always, thanks to our amazing contributors.

Our plan is to release regularly on a roughly 6 week cadence to make sure we're always getting the latest and greatest out to you.

We've also been cooking in the background on other components in the FAIR ecosystem, including significant work on [AspireCloud](https://github.com/aspirepress/AspireCloud) and [AspireExplorer](https://github.com/aspirepress/AspireExplorer) – plus, we've just wrapped up our hackathon with Patchstack, building the groundwork for our labeler system (more on that soon!).

P.S. Still getting your head around FAIR? Check out [our explainer video and post](/blog/what-is-fair/)!

## What's New in 1.1

### WP-CLI Plugin Support

FAIR Plugin now includes WP-CLI support for plugins, making it possible to manage plugins directly from the command line using their DID. ([#277](https://github.com/fairpm/fair-plugin/pull/277))

### Better User Experience

- **More Accurate Update Dates**: Plugin cards now display a more accurate "Last Updated" date, helping users better assess plugin maintenance status. ([#262](https://github.com/fairpm/fair-plugin/pull/262))
- **Consistent Modal Tabs**: Tabs in the "View Details" and "More Details" modals now display in a consistent, predictable order. ([#310](https://github.com/fairpm/fair-plugin/pull/310))

### Improved Compatibility

- **Improved Avatar Handling**: Only Gravatar URLs are replaced, ensuring other avatar services are not impacted. ([#302](https://github.com/fairpm/fair-plugin/pull/302))
- **Updated Browser List**: The browser compatibility feature now includes an updated browser list to provide more accurate compatibility warnings. ([#312](https://github.com/fairpm/fair-plugin/pull/312))

### Improved FAIR Identifiers

- **FAIR Plugin Directory Integration**: The "Add Plugins" screen now features a "FAIR Plugin Directory" link that takes users directly to [https://fair.pm/packages/plugins](https://fair.pm/packages/plugins), replacing the previous WordPress.org Plugin Directory link. ([#305](https://github.com/fairpm/fair-plugin/pull/305))
- **FAIR Plugin Assets**: FAIR Plugin now has its own placeholder banner and icon. ([#306](https://github.com/fairpm/fair-plugin/pull/306))

## Upgrade Notes

This is a feature release that maintains backward compatibility with version 1.0. All users are encouraged to upgrade to take advantage of these improvements.

## Try FAIR 1.1 today

Ready to explore FAIR?

- **Install the FAIR Plugin** [release ZIP](https://github.com/fairpm/fair-plugin/releases/download/1.1.0/fair-plugin-1.1.0.zip) to search for verified plugins from both official and independent sources.
- **Browse packages** at [fair.pm/packages](https://fair.pm/packages)
- **Publish your own plugin** using [Mini-FAIR](https://github.com/fairpm/mini-fair-repo)
- **Find us on GitHub** as [FAIR PM](https://github.com/fairpm/)
- **Join the conversation** by [getting involved](https://fair.pm/get-involved/) in our [Slack](https://chat.fair.pm/) or [GitHub Discussions](https://github.com/orgs/fairpm/discussions)

If you're a developer, publisher, or simply curious, we'd love to hear your thoughts.
