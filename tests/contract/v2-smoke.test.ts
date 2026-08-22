import LandingAIADE, { toFile } from 'landingai-ade';
import fs from 'fs';
import path from 'path';

// V2 (`client.v2`) contract smoke test. Like the V1 one, it hits the LIVE staging API — gated on a
// real key, excluded from the default `./scripts/test` run, and required only on `spec-sync/*`
// branches (see .github/workflows/pr-gates.yml). Run locally with `yarn test:contract`.
//
// Two-host reminder: `environment: 'staging'` routes V2 to the API host api.ade.staging.landing.ai
// (NOT the aide gateway, which only serves the spec).
const apiKey = process.env['LANDINGAI_ADE_STAGING_APIKEY'];
const runIf = apiKey ? test : test.skip;

const SAMPLE_MARKDOWN = '# Acme Inc. — Q1 Report\n\nTotal revenue for the quarter was **$1,250,000**.\n';
const SAMPLE_PDF = path.join(__dirname, 'sample.pdf');

// This file is a merge gate against a LIVE environment, so it has to fail fast and legibly. The
// SDK ships an 8-minute timeout with 2 retries — right for a real caller parsing a 500-page scan,
// wrong for a gate: a route staging accepts but never answers then outlives jest's per-test
// timeout, and all you get is jest's own "Exceeded timeout of N ms" pointing at the `runIf` line,
// with nothing about which request never came back. Cap one request at 45s so the failure comes
// from the SDK instead, naming the route.
//
// Budgeting the per-test timeouts: `maxRetries: 0` holds for the job/list routes, but the V2 sync
// methods (parse/extract/ground) pin `maxRetries: 1` per request in src/resources/v2/v2.ts, and a
// per-request value beats the client default — so budget 2 x REQUEST_TIMEOUT (~91s) for a sync
// call and 1 x for everything else. Every per-test timeout below stays above its own budget.
//
// Trade-off: a transient 429/5xx now fails the run instead of being retried away. That is the
// intended bias for a gate — a retry cannot rescue a genuinely dead upstream, it only hides it —
// and the whole suite is ~40s, so re-running the job is cheap.
const REQUEST_TIMEOUT = 45_000;

/**
 * Whether `value` survives a round-trip through `places` decimal places.
 *
 * Counting the digits in `String(value)` would be the obvious check and the
 * wrong one: the wire values are binary floats, so a number the gateway
 * serialized with 2 decimals (`0.42`) scales to `42.000000000000006`, and only
 * a tolerance comparison reads that back as "2 decimal places". `1e-6` sits
 * well above that representation noise (~1e-11 here) and well below the `0.1`
 * an extra decimal place would contribute, so a genuinely over-precise number
 * (`0.4237` → `42.37`) still fails.
 */
const roundsTo = (value: number, places: number) => {
  const scaled = value * 10 ** places;
  return Math.abs(scaled - Math.round(scaled)) < 1e-6;
};

/** The client every test in this file must use; see REQUEST_TIMEOUT above for why it is configured. */
const stagingClient = () =>
  new LandingAIADE({
    apikey: apiKey!,
    environment: 'staging',
    timeout: REQUEST_TIMEOUT,
    maxRetries: 0,
  });

describe('V2 contract (staging)', () => {
  runIf(
    'extract (sync) returns a structured extraction with range_units metadata',
    async () => {
      const client = stagingClient();
      const res = await client.v2.extract({
        schema: { type: 'object', properties: { revenue: { type: 'string' } } },
        markdown: SAMPLE_MARKDOWN,
      });
      expect(res.extraction).toBeDefined();
      // Wired by the V2 spec-sync: ranges are declared in code-point units, and
      // `version` was renamed to `model_version` in the metadata.
      expect(res.metadata.range_units).toBe('unicode_codepoints');
      expect(typeof res.metadata.model_version).toBe('string');
    },
    120_000, // sync call: 2 x REQUEST_TIMEOUT
  );

  runIf(
    'ground (sync) resolves extracted fields to structure blocks',
    async () => {
      const client = stagingClient();
      // Ground is a pure, stateless join of an extraction's `{value, ranges}`
      // leaves against the `grounding.range` on each `structure` block, so a
      // self-consistent synthetic pair exercises the route without a full
      // parse→extract chain. The single field's range overlaps `text-1`.
      const box = { xmin: 0.1, ymin: 0.12, xmax: 0.42, ymax: 0.15 };
      const res = await client.v2.ground({
        extraction_metadata: {
          invoice_number: { value: 'INV-042', ranges: [{ start: 13, end: 31 }] },
        },
        structure: {
          type: 'document',
          children: [
            {
              type: 'page',
              page: 1,
              children: [
                {
                  type: 'text',
                  id: 'text-1',
                  grounding: { page: 1, range: { start: 13, end: 31 }, box },
                },
              ],
            },
          ],
        },
      });
      expect(res.grounding).toBeDefined();
      expect(res.grounding['invoice_number']).toBeDefined();
      expect(typeof res.metadata.job_id).toBe('string');
    },
    120_000, // sync call: 2 x REQUEST_TIMEOUT
  );

  runIf(
    'extractJobs job envelope carries the metadata receipt field',
    async () => {
      const client = stagingClient();
      const created = await client.v2.extractJobs.create({
        schema: { type: 'object', properties: { revenue: { type: 'string' } } },
        markdown: SAMPLE_MARKDOWN,
      });
      // `pollUntilTerminal` (src/resources/v2/_base.ts) awaits `getJob()` and only THEN checks the
      // deadline, so a poll starting just under it still costs a full REQUEST_TIMEOUT on top. Worst
      // case is therefore create (45s) + wait deadline (60s) + one in-flight poll (45s) = 150s,
      // which stays under the 180s per-test timeout below. Raising this wait deadline without
      // raising that timeout would reintroduce the opaque jest kill this file exists to avoid.
      const done = await client.v2.extractJobs.wait(created.job_id, { timeout: 60_000 });
      expect(done.is_terminal).toBe(true);
      // Wired by the V2 spec-sync: the job envelope now carries a top-level
      // `metadata` receipt alongside `output_url` when the result was delivered
      // to an `output_save_url`. This job is inline, so the receipt is `null`
      // and the metadata lives on the result instead.
      expect(done.metadata === null || typeof done.metadata === 'object').toBe(true);
      if (done.status === 'completed' && done.raw['output_url'] == null) {
        expect(done.metadata).toBeNull();
        const result = done.result as LandingAIADE.V2ExtractResult;
        expect(typeof result.metadata.duration_ms).toBe('number');
      }
    },
    180_000, // create (1 x) + 60s wait deadline + one in-flight poll (1 x) = 150s worst case
  );

  runIf(
    'parse (sync) exposes the optional grounding confidence as a probability at every level',
    async () => {
      const client = stagingClient();
      // Wired by the V2 spec-sync: `Grounding.confidence`, which the spec now
      // documents at EVERY level of the tree (page and element groundings roll their
      // words up, not just `atomic_grounding` entries). Deliberately does NOT pin
      // `model` — `confidence` is only populated at word granularity (`dpt-3-fast`),
      // and whether a given family is servable depends on how the staging cluster was
      // booked (`dpt-3-fast` needs a GPU-backed booking; against one without it the
      // request hangs until the test times out). That is an environment property, not
      // an SDK contract, so this asserts the field's contract against whatever model
      // the gateway defaults to — absent, or a probability in `[0, 1]` — and leaves
      // the populated-value and weakest-link assertions to the mocked test in
      // tests/api-resources/v2/v2.test.ts, which controls the response body.
      const res = await client.v2.parse({
        document: await toFile(fs.readFileSync(SAMPLE_PDF), 'sample.pdf', { type: 'application/pdf' }),
        options: { atomic_grounding: true },
      });
      const pages = res.structure?.children ?? [];
      expect(pages.length).toBeGreaterThan(0);
      // `table` elements nest their cells, and the words of a table live on the
      // cells — so flatten one level down before collecting segments.
      const elements = pages.flatMap((page) =>
        (page.children ?? []).flatMap((el) => [el, ...(el.children ?? [])]),
      );
      const segments = elements.flatMap((el) => el.atomic_grounding ?? []);
      expect(segments.length).toBeGreaterThan(0);
      // Every grounding in the response — page nodes, element and cell nodes, and
      // the fine-grained segments — is held to the same contract.
      const groundings = [
        ...pages.map((page) => page.grounding),
        ...elements.map((el) => el.grounding),
        ...segments,
      ];
      for (const grounding of groundings) {
        const confidence = grounding?.confidence;
        // `== null` covers both absent (line-granularity models, and blocks with no
        // transcribed word, omit the key) and an explicit `null`.
        expect(confidence == null || typeof confidence === 'number').toBe(true);
        if (confidence != null) {
          expect(confidence).toBeGreaterThanOrEqual(0);
          expect(confidence).toBeLessThanOrEqual(1);
        }
      }
    },
    120_000, // sync call: 2 x REQUEST_TIMEOUT
  );

  runIf(
    'parse (sync) returns grounding coordinates and confidence at the documented precision',
    async () => {
      const client = stagingClient();
      // Wired by the V2 spec-sync: the spec now pins how precise both grounding
      // numbers are on the wire — `Box` coordinates carry at most 5 decimal places
      // and `Grounding.confidence` at most 2. The gateway clamps and rounds before
      // serializing, so what a caller reads back IS the stored value; a finer number
      // arriving here would mean the SDK is handing out digits the contract never
      // promised. Deliberately does NOT pin `model`, for the same reason as the
      // confidence test above: which model families a staging cluster can serve
      // depends on how it was booked, not on the SDK. So `confidence` is asserted
      // absent-or-valid, and the exact-value assertions live in the mocked test in
      // tests/api-resources/v2/v2.test.ts, which controls the response body.
      const res = await client.v2.parse({
        document: await toFile(fs.readFileSync(SAMPLE_PDF), 'sample.pdf', { type: 'application/pdf' }),
        options: { atomic_grounding: true },
      });
      const pages = res.structure?.children ?? [];
      expect(pages.length).toBeGreaterThan(0);
      // Table cells hold a table's words, so flatten one level down as above.
      const elements = pages.flatMap((page) =>
        (page.children ?? []).flatMap((el) => [el, ...(el.children ?? [])]),
      );
      const groundings = [
        ...pages.map((page) => page.grounding),
        ...elements.map((el) => el.grounding),
        ...elements.flatMap((el) => el.atomic_grounding ?? []),
      ];
      expect(groundings.filter((grounding) => grounding != null).length).toBeGreaterThan(0);
      for (const grounding of groundings) {
        if (grounding == null) continue;
        // `box` is required on `Grounding`, so check it before dereferencing —
        // a missing one is a contract failure, and this reports it as one
        // rather than as a TypeError three lines down.
        expect(grounding.box).toBeDefined();
        for (const coordinate of [
          grounding.box.xmin,
          grounding.box.ymin,
          grounding.box.xmax,
          grounding.box.ymax,
        ]) {
          expect(coordinate).toBeGreaterThanOrEqual(0);
          expect(coordinate).toBeLessThanOrEqual(1);
          expect(roundsTo(coordinate, 5)).toBe(true);
        }
        // `== null` covers both an omitted key and an explicit `null`; `confidence`
        // is optional, so absent is as valid an answer as a scored one.
        if (grounding.confidence != null) {
          expect(roundsTo(grounding.confidence, 2)).toBe(true);
        }
      }
    },
    120_000, // sync call: 2 x REQUEST_TIMEOUT
  );

  runIf(
    'parseJobs.list returns a normalized JobList against the new envelope',
    async () => {
      const client = stagingClient();
      const list = await client.v2.parseJobs.list({ page: 0, page_size: 1 });
      expect(Array.isArray(list.jobs)).toBe(true);
      for (const job of list.jobs) {
        expect(typeof job.job_id).toBe('string');
        // The list envelope now emits ISO-8601 timestamps; the normalizer maps
        // them to `Date` (or `null` when absent).
        expect(job.created_at === null || job.created_at instanceof Date).toBe(true);
      }
    },
    60_000, // list route: 1 x REQUEST_TIMEOUT
  );
});
