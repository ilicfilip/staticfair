---
title: "FAIR Connect 1.2.2 Release Announcement"
description: "Version 1.2.2 of FAIR Connect fixes a fatal error introduced in 1.2.1 that impacts the updating process. Manual update instructions included."
pubDate: 2025-12-24
author: "Joe Dolson"
tags:
  - "Release Notes"
---

Version 1.2.2 of FAIR Connect is a fast follow up to our version 1.2.1 release. This release fixes a fatal error introduced in 1.2.1 that impacts the updating process.

If you previously updated to 1.2.1, you will need to perform this update manually.

## Manually Updating to 1.2.2

1. Deactivate FAIR Connect.
2. [Download FAIR Connect 1.2.2](https://github.com/fairpm/fair-plugin/releases/download/1.2.2/fair-plugin-1.2.2.zip).
3. Go to *Plugins > Add New Plugin > Upload Plugin.*
4. Select the FAIR Connect 1.2.2 ZIP file and click the "Install Now" button.
5. Click the "Replace current with uploaded" button.
6. Activate FAIR Connect.

## Update via WP-CLI

```
wp plugin deactivate fair-plugin && wp plugin install --activate --force https://github.com/fairpm/fair-plugin/releases/download/1.2.2/fair-plugin-1.2.2.zip
```

## Try FAIR Connect Today

Ready to explore FAIR?

- **Browse packages** at [fair.pm/packages](https://fair.pm/packages)
- **Publish your own plugin** using [FAIR Beacon](https://github.com/fairpm/fair-beacon)
- **Find us on GitHub** as [FAIRPM](https://github.com/fairpm/)
- **Join the conversation** by [getting involved](https://fair.pm/get-involved/) in our [Slack](https://chat.fair.pm/) or [GitHub Discussions](https://github.com/orgs/fairpm/discussions)

If you're a developer, publisher, or simply curious, we'd love to hear your thoughts.
