# TwitchAdSolutions

**Watch Twitch streams without sitting through ad breaks.**
Free, for desktop browsers.

When Twitch starts an ad break, the script quietly switches your player to an ad-free copy of
the same stream, then switches back when the break ends. If Twitch has no ad-free copy to give,
the script cuts the ad out instead. It runs in your browser, with no account and no proxy.

```
Twitch stream  ──►  ad break?  ──►  ad-free copy of the stream  ──►  your player
                        └──►  no copy available  ──►  ad cut out
```

## Install

**[Install VAFT](https://raw.githubusercontent.com/ahizechi/TwitchAdSolutions/master/vaft/vaft.user.js)**
in a userscript manager such as [Violentmonkey](https://violentmonkey.github.io/) or
[Tampermonkey](https://www.tampermonkey.net/), then reload Twitch. Your manager keeps it up to date.

Use one Twitch ad blocker at a time. Two scripts fighting over the same player cause freezes and
black screens.

## Features

### Ad breaks swapped out

While an ad plays for everyone else, you keep watching the stream. The script asks Twitch for
the copy it sends to embedded and pop-out players, which usually has no ads, and plays that
instead.

- **Same quality where possible.** The embedded and pop-out copies come at full quality. If only
  the autoplay copy is clean, you'll watch at 360p until the break ends.
- **No clean copy?** The ad segments are removed, so the stream may pause for a moment rather
  than show the ad.
- **When the break ends,** the player reloads for a moment and returns to your usual quality,
  volume and settings.

### Unsticks a frozen player

If the stream stops moving while it still has video to play, the script pauses and resumes it
for you.

### Takes over from the original script

This fork replaces [pixeltris's original](https://github.com/pixeltris/TwitchAdSolutions), which
was archived on 5 March 2026. If you open the install link with the original installed, your
manager offers to replace it, because both use the same name. If both copies still end up
running, this one takes control of the player.

### Fixed in this fork

- Playlist requests that fail now report the failure instead of leaving the player waiting.
- A playlist the script can't read plays as Twitch sent it, ads included, instead of breaking
  playback.
- Backup copies are tried again on the next ad break after a failed attempt.
- Your quality and volume changes survive the reload after an ad.
- Ad-tracking links are removed from the playlists the script edits.
- Long sessions no longer build up old channels and players in memory.

## Get started

1. **Install a userscript manager.** [Violentmonkey](https://violentmonkey.github.io/) or
   [Tampermonkey](https://www.tampermonkey.net/) both work.
2. **Install the script.** Open the
   [VAFT link](https://raw.githubusercontent.com/ahizechi/TwitchAdSolutions/master/vaft/vaft.user.js)
   and press **Install** (or **Replace**, if you had the original).
3. **Turn off other Twitch ad blockers,** including any older copy of this script.
4. **Reload Twitch.** To check it's running, open the browser console (F12) on a stream and look
   for `hookWorkerFetch (vaft)`.

If it doesn't work, see the [troubleshooting guide](issues.md).

### Using uBlock Origin instead

1. Open the uBlock Origin dashboard. In **My filters**, add `twitch.tv##+js(twitch-videoad)` and
   press **Apply changes**.
2. In **Settings**, tick **I am an advanced user**, then click the gear beside it. Add the
   [VAFT resource URL](https://raw.githubusercontent.com/ahizechi/TwitchAdSolutions/master/vaft/vaft-ublock-origin.js)
   to `userResourcesLocation`, separated by a space from any URL already there.
3. Restart the browser and reload Twitch.

To remove it, delete the filter and only the URL you added (use `unset` if none are left). uBlock
can hold on to a cached copy; see [upstream issue #200](https://github.com/pixeltris/TwitchAdSolutions/issues/200).

## Which script?

| Script | When to use it | Install |
| --- | --- | --- |
| **VAFT** | Recommended for everyone. | [Userscript](https://raw.githubusercontent.com/ahizechi/TwitchAdSolutions/master/vaft/vaft.user.js) · [uBlock Origin](https://raw.githubusercontent.com/ahizechi/TwitchAdSolutions/master/vaft/vaft-ublock-origin.js) |
| video-swap-new | Older approach. Try it only if VAFT misbehaves on your setup. | [Userscript](https://raw.githubusercontent.com/ahizechi/TwitchAdSolutions/master/video-swap-new/video-swap-new.user.js) · [uBlock Origin](https://raw.githubusercontent.com/ahizechi/TwitchAdSolutions/master/video-swap-new/video-swap-new-ublock-origin.js) |

Install one only. The old `strip` script is unmaintained and listed in the
[full catalog](full-list.md#web-browser-scripts-userscript). The `embed-test` branch is an
unsupported experiment.

## What you need

- Twitch in a desktop browser. The mobile site (`m.twitch.tv`) isn't supported.
- Violentmonkey, Tampermonkey or uBlock Origin. Greasemonkey isn't supported, and
  [Userscripts for Safari](https://apps.apple.com/us/app/userscripts/id1463298887) is untested.

## Tested so far

Live in Chromium on 24 November 2026: both scripts load, play continuously and switch to an
ad-free copy during a simulated ad break, and this fork takes over from the original. Twitch
didn't serve a real ad during that check, and Firefox, the userscript managers and uBlock
Origin haven't been tested live yet. Every change also has an offline test.

## Other options

These are independent projects with their own maintainers. We haven't checked them.

- [TTV LOL PRO](https://github.com/younesaassila/ttv-lol-pro): [Chrome](https://chromewebstore.google.com/detail/ttv-lol-pro/bpaoeijjlplfjbagceilcgbkcdjbomjd), [Firefox](https://addons.mozilla.org/addon/ttv-lol-pro/). Uses proxies, which can buffer or go down; see [proxy issues](full-list.md#proxy-issues).
- [Purple AdBlock](https://github.com/arthurbolsoni/Purple-adblock/): [Chrome](https://chromewebstore.google.com/detail/purple-ads-blocker/lkgcfobnmghhbhgekffaadadhmeoindg), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/purpleadblock/), [userscript](https://raw.githubusercontent.com/arthurbolsoni/Purple-adblock/refs/heads/main/platform/tampermonkey/dist/purpleadblocker.user.js).
- [AdGuard Extra](https://github.com/AdguardTeam/AdGuardExtra/): [Chrome](https://chromewebstore.google.com/detail/adguard-extra-beta/mglpocjcjbekdckiahfhagndealpkpbj), [Firefox](https://github.com/AdguardTeam/AdGuardExtra/#firefox), [userscript](https://userscripts.adtidy.org/release/adguard-extra/1.0/adguard-extra.user.js).
- Alternate Player for Twitch.tv: [Firefox](https://addons.mozilla.org/en-US/firefox/addon/twitch_5/).
- [TTV Ad Mute](https://github.com/drj101687/ttv-ad-mute): [Firefox](https://addons.mozilla.org/en-US/firefox/addon/twitch-tv-ad-mute/). Mutes ads rather than removing them.
- [Twitch Turbo](https://www.twitch.tv/turbo): Twitch's own paid ad-free subscription.

More in the [full catalog](full-list.md) and [zGato's list](https://github.com/zGato/ScrewTwitchAds).

## Problems and support

Start with the [troubleshooting guide](issues.md). GitHub Issues and Discussions are turned off
on this fork; the guide links to the original project's reports.

## Development

    node tests/check.cjs

The checks run offline: syntax, matching userscript and uBlock copies, install and update links,
and playback against recorded Twitch playlists. They also run on every push. Releases come from
the manual **Publish fork release** workflow, from `master` only, with a new `fork-v` tag.

## Credits and licence

Built on the work of [pixeltris and the TwitchAdSolutions contributors](https://github.com/pixeltris/TwitchAdSolutions),
[cleanlock/VideoAdBlockForTwitch](https://github.com/muleyo/VideoAdBlockForTwitch#credits) (now
muleyo/VideoAdBlockForTwitch) and saucettv/VideoAdBlockForTwitch (no longer online). See the
[licence](LICENSE).
