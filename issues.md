# Issues with `vaft` / `video-swap-new`

## Neither script works

If you're using the uBlock Origin version of the script you need to make sure that it's set up correctly based on the instructions in the README. Check the script is active by opening your browsers developer console, refreshing a stream, and searching for `hookWorkerFetch (vaft)` / `hookWorkerFetch (video-swap-new)`. If you don't see this, then the script isn't being injected and you need to find the reason why.

If you're using Chrome with a Manifest V3 based userscript manager (e.g. Tampermonkey) you need to manually enable user script permissions in the extension settings:

- Go to `chrome://extensions`
- Click the `Details` button on the extension
- Where it says `Allow user scripts` make sure it's enabled


## Streams sometimes appear offline when ads occur

The cause remains unresolved in [upstream issue #477](https://github.com/pixeltris/TwitchAdSolutions/issues/477).

## The player shows a loading wheel for a long time

The `Blocking ads (stripping)` banner means stripping is active and a backup stream is unavailable. See [upstream issue #474](https://github.com/pixeltris/TwitchAdSolutions/issues/474) for the reported behavior.

## Mobile Twitch is unsupported

The scripts target desktop Twitch. See the [catalog](full-list.md) for third-party mobile options.

## Long black screen during ads

The scripts can reload the player when entering/leaving ads. On some systems this may cause a long period of time where the player is black as the player is loading back in. There currently isn't any fix for this. Try a different script / solution.

## `vaft`

### Freezing / buffering / repeating segments / audio desyncs

`vaft` has a long standing problem of playback problems (freezing / buffering / repeating segments / audio desyncs).

The player may switch between media playlists during ads, which can interrupt playback. Pausing and resuming can restore playback.

The script is configured to do this automatically for you:

https://github.com/pixeltris/TwitchAdSolutions/blob/9cae451c04a9a94859da7de19c367b58afdd95bc/vaft/vaft.user.js#L49-L54

- If it triggers but it still freezes try setting `PlayerBufferingDoPlayerReload` to `true`. Player reloads generally have less problems.
- If you're having issues with it triggering when the player is genuinely buffering then adjust `PlayerBufferingDelay` / `PlayerBufferingSameStateCount`.
- If it triggers too frequently then increase the value of `PlayerBufferingMinRepeatDelay`. Decrease this if it triggers, freezes, then has to wait a long time to re-trigger.
- If you don't want to use this and would like to fix the buffering manually yourself you can set `PlayerBufferingFix` to `false`.
- Setting `AlwaysReloadPlayerOnAd` to `true` may reduce freezing issues when entering into ads.

## `video-swap-new`

### Freezing / buffering during ads

There currently isn't a fix for freezing / buffering issues for `video-swap-new`. Try a different script / solution.
