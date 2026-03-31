---
title: "FAIR Connect 1.2.1 Release Announcement"
description: "Version 1.2.1 of FAIR Connect is a fast follow-up to version 1.2, with key bug fixes and minor feature additions including hashed package directory names."
pubDate: "2025-12-22T00:00:00"
author: "admin"
categories:
  - "Uncategorized"
tags:
  - "Release Notes"
draft: false
---

Version 1.2.1 of FAIR Connect is a fast follow up to our version 1.2 release. This release incorporates a few key fixes to issues that showed up in the release.

## Bug Fixes

- Verify array or object parts exist before using. Fixes an issue fetching metadata where data was accessed without checking existence.
- Fix modal for empty $sections. Fixes an issue in the View details modal when the sections data is empty.
- More FAIR Connect naming changes. Catches a few more places where the name of the plugin can be changed.

## Features Included

There are a few minor feature changes also included in this release that had just missed the 1.2 release deadline.

- Hashing of package directory names on install. A change to help manage the directory naming of packages when they are installed by appending the DID hash to the directory.
- Maintain directory name on updates. Ensures that directory names are maintained (either as slug or slug-didhash) when a package is updated.

## Upgrade Notes

This is a bug fix release that maintains backward compatibility with version 1.1. All users are encouraged to upgrade to benefit from these fixes.

## Install FAIR 1.2.1

Ready to explore FAIR?

- Install the FAIR Connect release ZIP to search for verified plugins from both official and independent sources.
- Browse packages at fair.pm/packages
- Publish your own plugin using FAIR Beacon
- Find us on GitHub as FAIRPM
- Join the conversation by getting involved in our Slack or GitHub Discussions

If you’re a developer, publisher, or simply curious, we’d love to hear your thoughts.
