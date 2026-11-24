const assert = require('node:assert/strict');
const { loadScript, loadWorker, outcome } = require('./browser.cjs');

const host = 'https://cdn.invalid';
const masterUrl = 'https://usher.ttvnw.net/api/channel/hls/test.m3u8?ticket=fixture';
const mediaUrl = host + '/quality.m3u8';
const gqlUrl = 'https://gql.twitch.tv/gql';
const plainMedia = '#EXTM3U\n#EXTINF:1,live\n' + host + '/live.ts\n';
const adMedia = '#EXTM3U\n#EXT-X-DATERANGE:ID="stitched-ad",X-TV-TWITCH-AD-URL="https://tracking.invalid/ad",X-TV-TWITCH-AD-CLICK-TRACKING-URL="https://tracking.invalid/click"\n#EXTINF:1,live\n' + host + '/live.ts\n';

function json(value) { return JSON.stringify(value); }

function masterPlaylist(uri, { codecs = true } = {}) {
    return '#EXTM3U\n#EXT-X-SESSION-DATA:DATA-ID="FIXTURE",VALUE="ok"\n'
        + '#EXT-X-TWITCH-INFO:SERVER-TIME="20.0"\n'
        + '#EXT-X-STREAM-INF:BANDWIDTH=100000,RESOLUTION=640x360'
        + (codecs ? ',CODECS="avc1.42e01e"' : '')
        + '\n' + uri + '\n';
}

function fixture(context, url, body, init = {}) {
    context.run(`route(${json(url)}, ${json(body)}, ${json(init)})`);
}

async function playback(source, path) {
    const page = loadScript(source, path);
    const worker = loadWorker(page);
    fixture(worker, masterUrl, masterPlaylist(mediaUrl));
    fixture(worker, mediaUrl, plainMedia);
    const result = await outcome(worker.run(`fetch(${json(masterUrl)})`));
    assert.equal(result.state, 'fulfilled', 'healthy master playlist settles');
    assert.equal(result.value.status, 200);
    assert.match(await result.value.text(), /#EXT-X-STREAM-INF/);
    return { page, worker };
}

const cases = [
    {
        name: 'returns or rejects every playlist fetch',
        legacy: true,
        async run(source, path) {
            const { worker } = await playback(source, path);
            fixture(worker, mediaUrl, '', { readError: 'fixture body read failed' });
            const failed = await outcome(worker.run(`fetch(${json(mediaUrl)})`));
            assert.equal(failed.state, 'rejected', 'a body read failure reaches the playback caller');
            assert.match(failed.message, /fixture body read failed/);

            fixture(worker, mediaUrl, plainMedia);
            const recovered = await outcome(worker.run(`fetch(${json(mediaUrl)})`));
            assert.equal(recovered.state, 'fulfilled');
            assert.equal(await recovered.value.text(), plainMedia);
            fixture(worker, `${masterUrl}&new=1`, '', { networkError: 'fixture network failure' });
            const missing = await outcome(worker.run(`fetch(${json(`${masterUrl}&new=1`)})`));
            assert.equal(missing.state, 'rejected', 'a master playlist request also settles after a network failure');
        },
    },
    {
        name: 'returns sanitized ad links in the playlist',
        legacy: true,
        async run(source, path) {
            const { worker } = await playback(source, path);
            worker.run(`
                if (typeof BackupPlayerTypes !== 'undefined') BackupPlayerTypes = [];
                if (typeof OPT_BACKUP_PLAYER_TYPES !== 'undefined') OPT_BACKUP_PLAYER_TYPES = [];
            `);
            fixture(worker, mediaUrl, adMedia);
            const response = await outcome(worker.run(`fetch(${json(mediaUrl)})`));
            assert.equal(response.state, 'fulfilled');
            const body = await response.value.text();
            assert.doesNotMatch(body, /tracking\.invalid/);
            assert.match(body, /X-TV-TWITCH-AD-URL="https:\/\/twitch\.tv"/);
            assert.match(body, /X-TV-TWITCH-AD-CLICK-TRACKING-URL="https:\/\/twitch\.tv"/);
            assert.match(body, /live\.ts/);
        },
    },
    {
        name: 'preserves Fetch request forms and mixed GraphQL operations',
        async run(source, path) {
            const page = loadScript(source, path);
            const unrelated = 'https://other.invalid/log?q=gql';
            fixture(page, unrelated, 'untouched');
            const simple = await page.run(`fetch(${json(unrelated)})`);
            assert.equal(await simple.text(), 'untouched', 'unrelated requests bypass the GraphQL hook');
            fixture(page, gqlUrl, 'ok');
            const original = [
                { operationName: 'UnrelatedOperation', variables: { playerType: 'keep' } },
                { operationName: 'PlaybackAccessToken', variables: { playerType: 'frontpage' } },
            ];
            await page.run(`fetch(new Request(${json(gqlUrl)}, {
                method: 'POST',
                headers: new Headers([['authorization', 'fixture-only']]),
                body: ${json(json(original))}
            }))`);
            const observed = page.evaluate('requests.at(-1)');
            const operations = JSON.parse(observed.body);
            assert.equal(operations[0].variables.playerType, 'keep', 'sibling GraphQL payload is unchanged');
            assert.equal(operations[1].variables.playerType, 'popout', 'playback operation still reaches the configured player type');
            assert.equal(page.run('AuthorizationHeader'), 'fixture-only');
        },
    },
    {
        name: 'handles relative playlist variants and preserves an unchanged response',
        async run(source, path) {
            const page = loadScript(source, path);
            const worker = loadWorker(page);
            const relative = './fixture/quality.m3u8?sig=dummy';
            const resolved = 'https://usher.ttvnw.net/api/channel/hls/fixture/quality.m3u8?sig=dummy';
            const body = masterPlaylist(relative, { codecs: false });
            fixture(worker, masterUrl, body, {headers: {'x-fixture': 'kept'}});
            fixture(worker, resolved, plainMedia);

            const initial = await outcome(worker.run(`fetch(${json(masterUrl)})`));
            assert.equal(initial.state, 'fulfilled', 'optional playlist metadata does not block playback');
            assert.equal(initial.value.url, masterUrl, 'unchanged playlist keeps its resolution base URL');
            assert.equal(initial.value.headers.get('x-fixture'), 'kept');
            assert.equal(await initial.value.text(), body);
            const refreshed = await outcome(worker.run(`fetch(${json(masterUrl)})`));
            assert.equal(refreshed.state, 'fulfilled', 'relative query-bearing variants are valid during cache health checks');
            assert.ok(worker.evaluate('requests').some(record => record.url === resolved));
        },
    },
    {
        name: 'retries backup playback on a later ad break after temporary failure',
        only: 'video-swap-new',
        async run(source, path) {
            const { worker } = await playback(source, path);
            worker.run(`
                OPT_BACKUP_PLAYER_TYPES = ['fixture'];
                graphQLResponse = { status: 503, body: '{}' };
            `);
            fixture(worker, mediaUrl, adMedia);
            const first = await outcome(worker.run(`fetch(${json(mediaUrl)})`));
            assert.equal(first.state, 'fulfilled');
            assert.equal(worker.evaluate("workerMessages.filter(m => m.key === 'FetchRequest').length"), 1);
            fixture(worker, mediaUrl, plainMedia);
            await worker.run(`fetch(${json(mediaUrl)})`);
            fixture(worker, mediaUrl, adMedia);
            await worker.run(`fetch(${json(mediaUrl)})`);
            assert.equal(worker.evaluate("workerMessages.filter(m => m.key === 'FetchRequest').length"), 2);
        },
    },
    {
        name: 'keeps newer preferences and restores absent slots',
        async run(source, path) {
            const page = loadScript(source, path);
            const result = page.evaluate(`(() => {
                const activity = installPlayer();
                localStorage.setItem('volume', '0.1');
                dispatch('DOMContentLoaded');
                reloadTwitchPlayer(false);
                localStorage.setItem('volume', '0.9');
                advance(3000);
                return { activity, volume: localStorage.getItem('volume'),
                    quality: localStorage.getItem('video-quality'), muted: localStorage.getItem('video-muted') };
            })()`);
            assert.ok(result.activity.includes('reload'), 'failure-path fixture actually reloads the player');
            assert.equal(result.volume, '0.9', 'fresh volume choice survives delayed restore');
            assert.equal(result.quality, null, 'previously absent quality remains absent');
            assert.equal(result.muted, null, 'previously absent mute remains absent');
        },
    },
    {
        name: 'releases retired workers and generated Blob URLs',
        async run(source, path) {
            const page = loadScript(source, path);
            const result = page.evaluate(`(() => {
                const older = new Worker('blob:https://www.twitch.tv/old');
                const active = new Worker('blob:https://www.twitch.tv/current');
                older.terminate();
                simulateAds(1);
                return { stale: older.messages.length, active: active.messages.length,
                    retained: objectUrls.size, retired: older.terminated, revoked: revoked.length };
            })()`);
            assert.deepEqual(result, { stale: 0, active: 1, retained: 0, retired: true, revoked: 2 });
        },
    },
];

module.exports = { cases };
