---
title: "Fair Plugin version 0.4.0: Decentralized Installation!"
description: "Say hello to Fair Plugin 0.4.0! Install plugins using Decentralized IDs (DID) via the FAIR protocol, putting us firmly on the road towards 1.0."
pubDate: 2025-08-20
author: "Siobhan McKeown"
tags:
  - "Release Notes"
---

Say hello to the Fair plugin 0.4.0! With version 0.4.0 you can install a plugin from the plugins screen using the plugin's Decentralized ID (DID). This uses the decentralized FAIR protocol to install the plugin without touching a centralized repository. And once a plugin or theme with the correct headers is installed it will receive its updates using the FAIR protocol.

This is a big step towards decentralized package management and puts us firmly on the road towards 1.0 and a plugin directory which has no reliance on centralized infrastructure. Our roadmap for 1.0 includes the listing and search functionality to fully replace the existing plugins list.

### Try out 0.4.0

You can try out the decentralized functionality with a test plugin ID: `did:plc:deoui6ztyx6paqajconl67rz`

Or see it in action in this video:

<div class="video-responsive">
  <video controls preload="metadata" aria-label="Demonstration of installing a WordPress plugin using a Decentralized ID (DID) with Fair Plugin 0.4.0">
    <source src="/video/fair-plugin-0-4-demo.mp4" type="video/mp4" />
    Your browser does not support the video element.
  </video>
</div>

Also in this release:

- FAIR has improved compatibility with multisite, but now only allows network activation – since plugins and themes are only managed at the network level.
- Avatars are also managed more effectively across the network, with changes to how settings are stored (thanks [@norcross](https://github.com/norcross)!)
- Pings are now sent via IndexNow when content is deleted, ensuring that 404s are picked up sooner (thanks [@peterwilsoncc](https://github.com/peterwilsoncc)!)
- The browser update check has been updated to reflect current browsers.

Thanks as always to our fantastic contributors!

[Check out the full list of changes in our release post.](https://github.com/fairpm/fair-plugin/releases/tag/0.4.0)
