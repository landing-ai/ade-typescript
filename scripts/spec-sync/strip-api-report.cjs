#!/usr/bin/env node
// Post-process the api-extractor report (etc/landingai-ade.api.md) into a byte-STABLE form.
//
// api-extractor emits, for this SDK's cross-runtime fetch typings, a block of unused
// `import { RequestInit as RequestInit_N } from '../../../node_modules/...'` lines whose relative
// paths and alias numbers depend on the local node_modules layout — pure churn that would make the
// committed report differ machine-to-machine and defeat both PR-gate jobs. It also embeds
// `ae-forgotten-export` warning comments carrying volatile `dist/src/...:LINE:COL` source refs.
//
// None of that is public API: the actual declarations (class/interface/type/function signatures)
// stay, and they reference stable names (MergedRequestInit, _RequestInit, ...) declared elsewhere
// in the report. We drop only the volatile lines so `yarn api-extractor` is deterministic and a
// plain `git diff` on etc/ is a meaningful freshness/surface check.
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const reportPath = path.join(__dirname, '..', '..', 'etc', 'landingai-ade.api.md');

const drop = [
  /^import\b.*node_modules/, // unused, path-volatile fetch-typing imports
  /\(ae-forgotten-export\)/, // forgotten-export warning comments (some carry volatile source refs)
];

const original = fs.readFileSync(reportPath, 'utf8');
const cleaned =
  original
    .split('\n')
    .filter((line) => !drop.some((re) => re.test(line)))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n') // collapse any blank-line runs the deletions opened up
    .trimEnd() + '\n';

if (cleaned !== original) {
  fs.writeFileSync(reportPath, cleaned);
}
