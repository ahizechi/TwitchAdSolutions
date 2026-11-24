const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { cases } = require('./playback.cjs');

const root = resolve(__dirname, '..');
const formats = [
    ['vaft/vaft.user.js', 'vaft', false],
    ['vaft/vaft-ublock-origin.js', 'vaft', true],
    ['video-swap-new/video-swap-new.user.js', 'video-swap-new', false],
    ['video-swap-new/video-swap-new-ublock-origin.js', 'video-swap-new', true],
    ['strip/strip.user.js', 'strip', false],
];
const guard = String.raw`    if ( /(^|\.)twitch\.tv$/.test(document.location.hostname) === false ) { return; }`;
const header = 'twitch-videoad.js text/javascript';

function load(path, ref) {
    return (ref
        ? execFileSync('git', ['show', `${ref}:${path}`], { cwd: root, encoding: 'utf8' })
        : readFileSync(resolve(root, path), 'utf8')
    ).replaceAll('\r\n', '\n');
}

function bodyOf(source, ublock) {
    if (ublock) {
        assert.ok(source.startsWith(header + '\n'), 'uBlock resource marker');
        return source.slice(header.length + 1);
    }
    const marker = '// ==/UserScript==\n';
    assert.ok(source.startsWith('// ==UserScript==\n') && source.includes(marker), 'userscript metadata');
    return source.slice(source.indexOf(marker) + marker.length);
}

async function main() {
    const args = process.argv.slice(2);
    let ref;
    let only;
    while (args.length) {
        const option = args.shift();
        if (option === '--ref' && args[0] && !args[0].startsWith('-')) ref = args.shift();
        else if (option === '--case' && args[0]) only = args.shift();
        else throw new Error('Usage: node tests/check.cjs [--ref <git-ref>] [--case <test-name>]');
    }
    const scripts = formats.map(([path, name, ublock]) => ({
        path, name, ublock, source: bodyOf(load(path, ref), ublock),
    }));
    let failed = 0;
    const escaped = [];
    const onUnhandled = error => escaped.push(error);
    process.on('unhandledRejection', onUnhandled);

    function report(name, error) {
        if (error) failed++;
        console.log(`${error ? 'FAIL' : 'PASS'} ${name}${error ? ': ' + error.message : ''}`);
    }

    try {
        if (!only) {
            for (const script of scripts) {
                try {
                    execFileSync(process.execPath, ['--check', '-'], { input: script.source, stdio: 'pipe' });
                    report(`JavaScript syntax ${script.path}`);
                } catch (error) {
                    report(`JavaScript syntax ${script.path}`, error);
                }
            }
            for (const name of ['vaft', 'video-swap-new']) {
                const [user, ublock] = scripts.filter(script => script.name === name);
                try {
                    const lines = ublock.source.split('\n');
                    assert.equal(lines[1], "    'use strict';", 'Strict directive precedes the guard');
                    assert.equal(lines[2], guard, 'uBlock hostname guard');
                    lines.splice(2, 1);
                    assert.equal(lines.join('\n'), user.source, 'body must match after removing the guard');
                    report(`userscript and uBlock parity ${name}`);
                } catch (error) {
                    report(`userscript and uBlock parity ${name}`, new Error(error.message.split('\n')[0]));
                }
            }
        }
        const applicable = cases.filter(test => !only || test.name === only);
        if (!applicable.length) throw new Error(`Unknown test: ${only}`);
        for (const test of applicable) {
            for (const script of scripts) {
                if (test.only && test.only !== script.name) continue;
                if (script.name === 'strip' && !test.legacy) continue;
                let error;
                let deadline;
                try {
                    const timeout = new Promise((resolve, reject) => {
                        deadline = setTimeout(() => reject(new Error('Offline fixture did not settle')), 2000);
                    });
                    await Promise.race([test.run(script.source, script.path), timeout]);
                    await new Promise(resolve => setImmediate(resolve));
                    if (escaped.length) throw escaped[0];
                } catch (failure) {
                    error = failure;
                } finally {
                    clearTimeout(deadline);
                    escaped.length = 0;
                }
                report(`${test.name} [${script.path}]`, error);
            }
        }
    } finally {
        process.off('unhandledRejection', onUnhandled);
    }
    if (failed) process.exitCode = 1;
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
