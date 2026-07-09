/**
 * Manual smoke test for the V2 (`client.v2`) endpoints against a live environment.
 *
 * Drives every V2 surface end-to-end so you can confirm auth, routing, and the
 * response shapes against a real gateway. It is a manual/QA tool — NOT part of
 * the automated test suite (which uses mocked transports).
 *
 * Plain ESM JavaScript so it is copy-out-and-run: after installing the SDK
 * (`npm install github:landing-ai/ade-typescript#<branch-or-main>`), drop this
 * file into your project and run it with `node` — no TypeScript toolchain needed.
 *
 * This is a *live* test that can hit real endpoints (and consume credits), so —
 * unlike the client itself, which defaults to `production` — this script defaults
 * to `staging` when neither `--environment` nor `LANDINGAI_ADE_ENVIRONMENT` is set.
 * V2 lives on `api.ade.<env>.landing.ai`.
 *
 * Setup
 * -----
 *   Put your key in `.env.local` (auto-loaded), e.g.:
 *     VISION_AGENT_API_KEY=<your api key for the target environment>
 *     # optional: LANDINGAI_ADE_ENVIRONMENT=staging
 *   ...or export VISION_AGENT_API_KEY in your shell.
 *
 * Run
 * ---
 *   node v2_smoke_test.mjs                          # extract + files (no document needed)
 *   node v2_smoke_test.mjs --document ./sample.pdf  # + parse & workflow (sync & job)
 *   node v2_smoke_test.mjs --document-url https://.../sample.pdf
 *   node v2_smoke_test.mjs --only extract,extract_jobs
 *   node v2_smoke_test.mjs --environment dev
 *
 * Exit code is non-zero if any selected check failed, so it is CI-friendly too.
 */

import fs from 'node:fs';

import LandingAIADE, { toFile } from 'landingai-ade';

const ALL_CHECKS = ['files', 'extract', 'extract_jobs', 'parse', 'parse_jobs', 'workflow', 'workflow_jobs'];

/** A tiny self-contained markdown doc + schema so extract/files run without any file. */
const SAMPLE_MARKDOWN = '# Acme Inc. — Q1 Report\n\nTotal revenue for the quarter was **$1,250,000**.\n';

const REVENUE_SCHEMA = {
  type: 'object',
  properties: {
    revenue: { type: 'string', description: 'The total revenue figure, verbatim' },
    company: { type: 'string', description: 'The company name' },
  },
};

/**
 * Load `.env` then `.env.local` into process.env. Precedence (highest first):
 * an existing shell env var > `.env.local` > `.env`; within a file the LAST
 * assignment of a key wins (standard dotenv behavior). So if `.env.local` lists
 * the same key twice (e.g. a dev line then a staging line), the last one wins.
 */
function loadDotEnv() {
  const shellKeys = new Set(Object.keys(process.env));
  const fromFiles = {};
  for (const file of ['.env', '.env.local']) {
    let text;
    try {
      text = fs.readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    for (const rawLine of text.split('\n')) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (key) fromFiles[key] = value; // last assignment wins (within and across files)
    }
  }
  for (const [key, value] of Object.entries(fromFiles)) {
    if (!shellKeys.has(key)) process.env[key] = value; // a real shell env var still wins
  }
}

function parseArgs(argv) {
  const args = { timeout: 600_000 };
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i];
    const next = () => {
      const value = argv[++i];
      if (value === undefined) throw new Error(`Missing value for ${flag}`);
      return value;
    };
    switch (flag) {
      case '--environment':
        args.environment = next();
        break;
      case '--document':
        args.document = next();
        break;
      case '--document-url':
        args.documentUrl = next();
        break;
      case '--only':
        args.only = next();
        break;
      case '--parse-model':
        args.parseModel = next();
        break;
      case '--extract-model':
        args.extractModel = next();
        break;
      case '--timeout':
        args.timeout = Number(next());
        break;
      default:
        throw new Error(`Unknown argument: ${flag}`);
    }
  }
  return args;
}

/** Default this *live* smoke test to `staging`; return undefined to let the client read the env var. */
function resolveEnvironment(args) {
  if (args.environment) return args.environment;
  if (process.env['LANDINGAI_ADE_ENVIRONMENT']) return undefined;
  return 'staging';
}

function selectedChecks(only) {
  if (!only) return [...ALL_CHECKS];
  const chosen = only
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);
  const bad = chosen.filter((c) => !ALL_CHECKS.includes(c));
  if (bad.length) throw new Error(`Unknown check(s): ${bad.join(', ')}. Valid: ${ALL_CHECKS.join(', ')}`);
  return chosen;
}

function short(value, limit = 200) {
  let text;
  try {
    // JSON.stringify(undefined) is `undefined` (not a string), so fall back.
    text = typeof value === 'string' ? value : JSON.stringify(value) ?? String(value);
  } catch {
    text = String(value);
  }
  return text.length <= limit ? text : text.slice(0, limit) + '…';
}

/**
 * A *fresh* document source for one parse/workflow check, or null when the caller
 * passed neither `--document` nor `--document-url`. The `--document` case returns a
 * one-shot `fs.ReadStream` (readable only once), so call this once per check — a
 * single shared source would be drained by the first check and leave every check
 * after it uploading an empty body.
 */
function documentSource(args) {
  if (args.document) return { document: fs.createReadStream(args.document) };
  if (args.documentUrl) return { document_url: args.documentUrl };
  return null;
}

async function main() {
  loadDotEnv();
  const args = parseArgs(process.argv.slice(2));
  const checks = selectedChecks(args.only);

  if (!process.env['VISION_AGENT_API_KEY']) {
    console.error('VISION_AGENT_API_KEY is not set (put it in .env.local or export it). Aborting.');
    return 1;
  }

  const environment = resolveEnvironment(args);
  const clientOptions = {};
  if (environment) clientOptions.environment = environment;
  const client = new LandingAIADE(clientOptions);
  console.log(`V1 base: ${client.baseURL}  |  V2 base: ${client.v2BaseURL}\n`);

  const results = {};

  const record = async (name, fn) => {
    console.log(`── ${name} `.padEnd(60, '─'));
    try {
      const out = await fn();
      results[name] = 'PASS';
      console.log(`   PASS  ${short(out)}\n`);
    } catch (err) {
      results[name] = 'FAIL';
      console.log(`   FAIL  ${err?.constructor?.name ?? 'Error'}: ${err?.message ?? String(err)}`);
      console.error(err);
      console.log();
    }
  };

  const skip = (name, why) => {
    console.log(`── ${name} `.padEnd(60, '─') + `\n   SKIP  (${why})\n`);
    results[name] = 'SKIP';
  };

  let fileRef;

  if (checks.includes('files')) {
    await record('files.upload', async () => {
      fileRef = await client.v2.files.upload({
        file: await toFile(Buffer.from(SAMPLE_MARKDOWN), 'doc.md', { type: 'text/markdown' }),
      });
      return `file_ref=${fileRef}`;
    });
  }

  if (checks.includes('extract')) {
    await record('v2.extract (sync)', async () => {
      const res = await client.v2.extract({
        schema: REVENUE_SCHEMA,
        markdown: SAMPLE_MARKDOWN,
        ...(args.extractModel ? { model: args.extractModel } : {}),
      });
      return `extraction=${short(res.extraction)}  version=${res.metadata.version}`;
    });
  }

  if (checks.includes('extract_jobs')) {
    await record('v2.extractJobs (create+wait)', async () => {
      const job = await client.v2.extractJobs.create({ schema: REVENUE_SCHEMA, markdown: SAMPLE_MARKDOWN });
      const done = await client.v2.extractJobs.wait(job.job_id, { timeout: args.timeout });
      return `job=${done.job_id} status=${done.status} result=${done.result ? 'set' : 'none'}`;
    });
  }

  // Each document check pulls its OWN fresh source: `documentSource` hands back a
  // one-shot `fs.ReadStream` for `--document`, so a shared source would be drained by
  // the first check and leave the rest uploading an empty body.
  const workflowStep = { name: 'parse-extract', document: '$inputs.report', schema: REVENUE_SCHEMA };

  if (checks.includes('parse')) {
    const src = documentSource(args);
    if (!src) skip('v2.parse (sync)', 'no --document / --document-url');
    else {
      await record('v2.parse (sync)', async () => {
        const res = await client.v2.parse({ ...src, ...(args.parseModel ? { model: args.parseModel } : {}) });
        return short(res.markdown);
      });
    }
  }

  if (checks.includes('parse_jobs')) {
    const src = documentSource(args);
    if (!src) skip('v2.parseJobs (create+wait)', 'no --document / --document-url');
    else {
      await record('v2.parseJobs (create+wait)', async () => {
        const job = await client.v2.parseJobs.create({ ...src });
        const done = await client.v2.parseJobs.wait(job.job_id, { timeout: args.timeout });
        return `job=${done.job_id} status=${done.status}`;
      });
    }
  }

  if (checks.includes('workflow')) {
    const src = documentSource(args);
    if (!src) skip('v2.workflow (sync)', 'no --document / --document-url');
    else {
      await record('v2.workflow (sync)', async () => {
        const res = await client.v2.workflow({ inputs: { report: src }, steps: [workflowStep] });
        return `output keys=${short(Object.keys(res.output))}`;
      });
    }
  }

  if (checks.includes('workflow_jobs')) {
    const src = documentSource(args);
    if (!src) skip('v2.workflowJobs (create+wait)', 'no --document / --document-url');
    else {
      await record('v2.workflowJobs (create+wait)', async () => {
        const job = await client.v2.workflowJobs.create({ inputs: { report: src }, steps: [workflowStep] });
        const done = await client.v2.workflowJobs.wait(job.job_id, { timeout: args.timeout });
        return `job=${done.job_id} status=${done.status}`;
      });
    }
  }

  console.log('═'.repeat(60));
  for (const [name, status] of Object.entries(results)) {
    console.log(`  ${status.padEnd(5)}  ${name}`);
  }
  const failed = Object.values(results).filter((s) => s === 'FAIL').length;
  console.log('═'.repeat(60));
  console.log(`${failed} failed / ${Object.keys(results).length} run`);
  return failed ? 1 : 0;
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
