# TwitchAdSolutions

TwitchAdSolutions provides userscripts and uBlock Origin resources for blocking ads on desktop Twitch. This fork maintains the scripts from [pixeltris/TwitchAdSolutions](https://github.com/pixeltris/TwitchAdSolutions), archived on 5 March 2026.

## Status

The scripts target desktop Twitch. Mobile Twitch (`m.twitch.tv`) is unsupported. The code passes offline checks. Live playback and browser and userscript-manager compatibility still need verification.

## Quick start

**Don't combine Twitch-specific ad blockers.**

1. Install a userscript manager such as [Violentmonkey](https://violentmonkey.github.io/) or [Tampermonkey](https://www.tampermonkey.net/).
2. Open the [VAFT userscript](https://raw.githubusercontent.com/ahizechi/TwitchAdSolutions/master/vaft/vaft.user.js) and confirm installation in the manager.
3. Reload a desktop Twitch stream. To check injection, open the browser console and look for `hookWorkerFetch (vaft)`. Use the [troubleshooting guide](issues.md) if the message is missing or playback stalls.

## Third-party recommendations

These options come from the upstream catalog and have independent maintainers. Their compatibility and privacy remain unverified. See the [proxy notes](full-list.md#proxy-issues) for reported buffering and downtime.

- [TTV LOL PRO](https://github.com/younesaassila/ttv-lol-pro) ([Chrome](https://chromewebstore.google.com/detail/ttv-lol-pro/bpaoeijjlplfjbagceilcgbkcdjbomjd), [Firefox](https://addons.mozilla.org/addon/ttv-lol-pro/)).
- [Twitch Turbo](https://www.twitch.tv/turbo).
- Alternate Player for Twitch.tv ([Firefox](https://addons.mozilla.org/en-US/firefox/addon/twitch_5/)). Its Chrome Web Store listing is no longer available.
- [Purple AdBlock](https://github.com/arthurbolsoni/Purple-adblock/) ([Chrome](https://chromewebstore.google.com/detail/purple-ads-blocker/lkgcfobnmghhbhgekffaadadhmeoindg), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/purpleadblock/), [userscript](https://raw.githubusercontent.com/arthurbolsoni/Purple-adblock/refs/heads/main/platform/tampermonkey/dist/purpleadblocker.user.js)).
- [AdGuard Extra](https://github.com/AdguardTeam/AdGuardExtra/) ([Chrome](https://chromewebstore.google.com/detail/adguard-extra-beta/mglpocjcjbekdckiahfhagndealpkpbj), [Firefox](https://github.com/AdguardTeam/AdGuardExtra/#firefox), [userscript](https://userscripts.adtidy.org/release/adguard-extra/1.0/adguard-extra.user.js)).
- [TTV Ad Mute](https://github.com/drj101687/ttv-ad-mute) ([Firefox](https://addons.mozilla.org/en-US/firefox/addon/twitch-tv-ad-mute/)).

More options appear in the [full catalog](full-list.md) and [zGato's list](https://github.com/zGato/ScrewTwitchAds).

## Scripts

| Script | Use | Install |
| --- | --- | --- |
| VAFT | Recommended. Attempts to find a usable backup stream and can strip ad segments when none is available. | [Userscript](https://raw.githubusercontent.com/ahizechi/TwitchAdSolutions/master/vaft/vaft.user.js) · [uBlock Origin resource](https://raw.githubusercontent.com/ahizechi/TwitchAdSolutions/master/vaft/vaft-ublock-origin.js) |
| video-swap-new | Older alternative. Avoid it for regular playback. | [Userscript](https://raw.githubusercontent.com/ahizechi/TwitchAdSolutions/master/video-swap-new/video-swap-new.user.js) · [uBlock Origin resource](https://raw.githubusercontent.com/ahizechi/TwitchAdSolutions/master/video-swap-new/video-swap-new-ublock-origin.js) |

Install one script only. When several copies run, the copy with the highest internal version controls the player: the fork's VAFT (26), then the fork's video-swap-new (25), then upstream copies (24 or lower). A copy that loaded earlier can leave some of its hooks active, so remove any copy you don't use.

The unmaintained `strip` script is listed in the [legacy catalog](full-list.md#web-browser-scripts-userscript). The inherited `embed-test` branch is experimental, unsupported, and outside the install options.

### Userscript installation and updates

The fork uses the same `@name` and `@namespace` as the original scripts. To migrate an upstream install, open the fork's userscript URL and accept the replacement in your manager. After replacement, the manager checks the fork's `master` raw URL for updates. Confirm the new update URL in the manager.

Greasemonkey is unsupported. Compatibility with [Userscripts for Safari](https://apps.apple.com/us/app/userscripts/id1463298887) remains unverified. See the [troubleshooting guide](issues.md) for browser permission settings.

### uBlock Origin installation

1. Open the uBlock Origin dashboard. In **My filters**, add `twitch.tv##+js(twitch-videoad)` and apply the change.
2. In **Settings**, enable **I am an advanced user** and click the gear icon beside it to open Advanced settings. Add the selected uBlock resource URL to `userResourcesLocation`. Keep existing resource URLs and separate them with spaces.
3. Restart uBlock Origin or the browser, then reload Twitch. The browser console should show `hookWorkerFetch` for the selected script.

To remove it, delete the Twitch filter and only the resource URL added for this script. Use `unset` if there are no URLs left.

The installer URLs follow `master`. To choose when to take new code, replace `master` in the raw resource URL with the full SHA of a reviewed fork commit. Cached or intermittent injection was reported in [upstream issue #200](https://github.com/pixeltris/TwitchAdSolutions/issues/200).

## What this fork changes

- Playlist requests report download failures and fall back to the original response if an optional rewrite fails.
- Ad and click-tracking URLs are replaced in playlists processed by the stripping path.
- Playlist handling accepts relative and query-bearing variant URLs, and backup selection can retry on a later ad break.
- The fetch hook rewrites Twitch playback-token operations and passes unrelated requests through unchanged.
- Player reloads preserve newer preference changes. Terminated workers and old channel entries are dropped from the script's tracking state.
- Install and update URLs point to the fork. The fork's internal versions are higher than upstream's, so the fork controls the player when an upstream copy is also installed.
- The manual release workflow uses a new `fork-v` tag and the exact `master` commit that passed offline checks.

## Reporting problems

GitHub Issues and Discussions are disabled on this fork. The [troubleshooting guide](issues.md) lists known symptoms and links to archived upstream reports.

## Development

Run `node tests/check.cjs` with Node.js. The command was verified locally with Node.js 26.13.1 and uses offline fixtures for syntax, userscript and uBlock resource parity, installation URLs, and playback behavior. The GitHub workflows select Node.js 24.

When available on GitHub, the manual **Publish fork release** workflow runs on `master` only. It requires a new `fork-v` tag and checks that the tag points to the tested commit before publishing.

## Credits and license

Credit to [pixeltris and the TwitchAdSolutions contributors](https://github.com/pixeltris/TwitchAdSolutions), [cleanlock/VideoAdBlockForTwitch](https://github.com/muleyo/VideoAdBlockForTwitch#credits) (now muleyo/VideoAdBlockForTwitch), and saucettv/VideoAdBlockForTwitch (no longer online). See the repository's [LICENSE](LICENSE).
