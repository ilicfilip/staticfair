---
title: "FAIR Connect 1.2.1 Release Announcement"
description: "Version 1.2.1 of FAIR Connect is a fast follow-up to version 1.2, incorporating key bug fixes and minor feature additions including hashed package directory names."
pubDate: 2025-12-22
author: "Joe Dolson"
tags:
  - "Release Notes"
---

Version 1.2.1 of FAIR Connect is a fast follow up to our version 1.2 release. This release incorporates a few key fixes to issues that showed up in the release.

## Bug Fixes

- [Verify array or object parts exist before using](https://github.com/fairpm/fair-plugin/commit/d108bebe42efdfef9a4813ab99d9eeb7e1002b5f). Fixes an issue fetching metadata where data was accessed without checking existence.
- [Fix modal for empty `$sections`](https://github.com/fairpm/fair-plugin/commit/61d3f9becbcb1e9e248467a305cc4caba3ada195). Fixes an issue in the View details modal when the sections data is empty.
- [More FAIR Connect naming changes](https://github.com/fairpm/fair-plugin/commit/4a39a28fe0857a712edecd4cb43f20c1a1ec70f4). Catches a few more places where the name of the plugin can be changed.

## Features Included

There are a few minor feature changes also included in this release that had just missed the 1.2 release deadline.

- [Hashing of package directory names on install](https://github.com/fairpm/fair-plugin/commit/bbe8aac9079df11b619941137c37bbbac0a22136). A change to help manage the directory naming of packages when they are installed by appending the DID hash to the directory.
- [Maintain directory name on updates](https://github.com/fairpm/fair-plugin/pull/378/files). Ensures that directory names are maintained (either as `slug` or `slug-didhash`) when a package is updated.

## Upgrade Notes

This is a bug fix release that maintains backward compatibility with version 1.1. All users are encouraged to upgrade to benefit from these fixes.

## Install FAIR 1.2.1

Ready to explore FAIR?

- **Install the FAIR Connect** [release ZIP](https://github.com/fairpm/fair-plugin/releases/download/1.2.1/fair-plugin-1.2.1.zip) to search for verified plugins from both official and independent sources.
- **Browse packages** at [fair.pm/packages](https://fair.pm/packages)
- **Publish your own plugin** using [FAIR Beacon](https://github.com/fairpm/fair-beacon)
- **Find us on GitHub** as [FAIRPM](https://github.com/fairpm/)
- **Join the conversation** by [getting involved](https://fair.pm/get-involved/) in our [Slack](https://chat.fair.pm/) or [GitHub Discussions](https://github.com/orgs/fairpm/discussions)

If you're a developer, publisher, or simply curious, we'd love to hear your thoughts.
