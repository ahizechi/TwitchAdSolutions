# TwitchAdSolutions

This repo aims to provide multiple solutions for blocking Twitch ads.

This repository is a fork of [pixeltris/TwitchAdSolutions](https://github.com/pixeltris/TwitchAdSolutions), which was archived on 5 March 2026. This fork builds on the original scripts and retains their attribution. The installers below follow this fork’s `master` branch. Current playback and browser-manager compatibility still need live verification.

**Don't combine Twitch specific ad blockers.**

## Recommendations

Proxies are the most reliable way of avoiding ads ([buffering / downtime info](full-list.md#proxy-issues)).

- `TTV LOL PRO` - [chrome](https://chrome.google.com/webstore/detail/ttv-lol-pro/bpaoeijjlplfjbagceilcgbkcdjbomjd) / [firefox](https://addons.mozilla.org/addon/ttv-lol-pro/) / [code](https://github.com/younesaassila/ttv-lol-pro)

Alternatively:

- `Twitch Turbo` - https://www.twitch.tv/turbo
- `Alternate Player for Twitch.tv` - [chrome](https://chrome.google.com/webstore/detail/alternate-player-for-twit/bhplkbgoehhhddaoolmakpocnenplmhf) / [firefox](https://addons.mozilla.org/en-US/firefox/addon/twitch_5/)
- `Purple AdBlock` - [chrome](https://chrome.google.com/webstore/detail/purple-adblock/lkgcfobnmghhbhgekffaadadhmeoindg) / [firefox](https://addons.mozilla.org/en-US/firefox/addon/purpleadblock/) / [userscript](https://raw.githubusercontent.com/arthurbolsoni/Purple-adblock/refs/heads/main/platform/tampermonkey/dist/purpleadblocker.user.js) / [code](https://github.com/arthurbolsoni/Purple-adblock/)
- `AdGuard Extra` - [chrome](https://chrome.google.com/webstore/detail/adguard-extra-beta/mglpocjcjbekdckiahfhagndealpkpbj) / [firefox](https://github.com/AdguardTeam/AdGuardExtra/#firefox) / [userscript](https://userscripts.adtidy.org/release/adguard-extra/1.0/adguard-extra.user.js)
- `vaft` - see below
- `TTV Ad Mute` - [firefox](https://addons.mozilla.org/en-US/firefox/addon/twitch-tv-ad-mute/) / [code](https://github.com/drj101687/ttv-ad-mute)

[Read this for a full list and descriptions.](full-list.md)

[Also see this list maintained by @zGato.](https://github.com/zGato/ScrewTwitchAds)

## Scripts

**There are better / easier to use methods in the above recommendations.**

- vaft - [userscript](https://raw.githubusercontent.com/ahizechi/TwitchAdSolutions/master/vaft/vaft.user.js) / [ublock](https://raw.githubusercontent.com/ahizechi/TwitchAdSolutions/master/vaft/vaft-ublock-origin.js)
  - Attempts to get a clean stream as fast as it can
  - If it fails to get a clean stream it removes ad segments (no playback until ad-free stream is found)
- video-swap-new - [userscript](https://raw.githubusercontent.com/ahizechi/TwitchAdSolutions/master/video-swap-new/video-swap-new.user.js) / [ublock](https://raw.githubusercontent.com/ahizechi/TwitchAdSolutions/master/video-swap-new/video-swap-new-ublock-origin.js)
  - Attempts to get a clean stream
  - If it fails to get a clean stream it removes ad segments (no playback until ad-free stream is found)
  - Not recommended, `vaft` is a better script

## Applying a script (uBlock Origin)

- Navigate to the uBlock Origin Dashboard (the extension options)
- Under the `My filters` tab add `twitch.tv##+js(twitch-videoad)`.
- Under the `Settings` tab, enable `I am an advanced user`, then click the cog that appears. Modify the value of `userResourcesLocation` from `unset` to the full url of the solution you wish to use (if a url is already in use, add a space after the existing url). e.g. `userResourcesLocation https://raw.githubusercontent.com/ahizechi/TwitchAdSolutions/master/vaft/vaft-ublock-origin.js`
- To ensure uBlock Origin loads the script I recommend that you disable/enable the uBlock Origin extension (or restart your browser).

To stop using the script, remove its Twitch filter in `My filters` and remove only the script URL you added to `userResourcesLocation`. If the setting has no other URLs, set it to `unset`.

To pin the uBlock resource to a reviewed snapshot, replace `master` in the supplied raw URL with that fork commit’s full SHA. A pinned URL stays on that commit until you change it.

*The scripts __may randomly stop being applied by uBlock Origin__ for unknown reasons ([#200](https://github.com/pixeltris/TwitchAdSolutions/issues/200)). It's recommended to use the userscript versions instead.*

## Applying a script (userscript)

Viewing one of the userscript files should prompt the given script to be added when you have a userscript manager installed.

To update an installation from the original repository, use the fork’s installer and check its update URL in your userscript manager. Review the new script before replacing your copy.

Userscript managers:

- https://violentmonkey.github.io/
- https://www.tampermonkey.net/
- https://apps.apple.com/us/app/userscripts/id1463298887

*Greasemonkey doesn't work with the scripts.*

## Issues with the scripts

If the script doesn't work or you're experiencing freezing / buffering issues see [issues.md](issues.md)
