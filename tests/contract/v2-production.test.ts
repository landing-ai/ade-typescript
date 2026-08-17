import LandingAIADE, { toFile } from 'landingai-ade';
import fs from 'fs';
import path from 'path';

// V2 (`client.v2`) production e2e — mirrors the staging V2 smoke (v2-smoke.test.ts) against the
// LIVE PRODUCTION API host api.ade.landing.ai. Same file-selection and gating as
// v1-production.test.ts: excluded from the default and `yarn test:contract` runs, picked up only by
// `yarn test:production` (jest.production.config.ts matches *-production.test.ts), which
// e2e-production.yml invokes on manual dispatch and as the release gate. Spends real credits. The
// soft-hidden `client.v2.buildSchema` surface is intentionally not covered, matching the staging smoke.
const apiKey = process.env['LANDINGAI_ADE_PRODUCTION_APIKEY'];
const runIf = apiKey ? test : test.skip;

const SAMPLE_MARKDOWN = '# Acme Inc. — Q1 Report\n\nTotal revenue for the quarter was **$1,250,000**.\n';
const SAMPLE_PDF = path.join(__dirname, 'sample.pdf');
const pdfBytes = fs.readFileSync(SAMPLE_PDF);

// `environment: 'production'` routes V2 to api.ade.landing.ai; the same key authenticates both hosts.
const newClient = () => new LandingAIADE({ apikey: apiKey!, environment: 'production' });

describe('V2 e2e (production)', () => {
  runIf(
    'extract (sync) returns a structured extraction with range_units metadata',
    async () => {
      const res = await newClient().v2.extract({
        schema: { type: 'object', properties: { revenue: { type: 'string' } } },
        markdown: SAMPLE_MARKDOWN,
      });
      expect(res.extraction).toBeDefined();
      // Ranges are declared in code-point units, and `version` was renamed to `model_version`.
      expect(res.metadata.range_units).toBe('unicode_codepoints');
      expect(typeof res.metadata.model_version).toBe('string');
    },
    60_000,
  );

  runIf(
    'ground (sync) resolves extracted fields to structure blocks',
    async () => {
      // Ground is a pure, stateless join of an extraction's `{value, ranges}` leaves against the
      // `grounding.range` on each `structure` block, so a self-consistent synthetic pair exercises
      // the route directly (parse and extract are covered by the other tests). The single field's
      // range overlaps `text-1`.
      const box = { xmin: 0.1, ymin: 0.12, xmax: 0.42, ymax: 0.15 };
      const res = await newClient().v2.ground({
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
                { type: 'text', id: 'text-1', grounding: { page: 1, range: { start: 13, end: 31 }, box } },
              ],
            },
          ],
        },
      });
      expect(res.grounding).toBeDefined();
      expect(res.grounding['invoice_number']).toBeDefined();
      expect(typeof res.metadata.job_id).toBe('string');
    },
    60_000,
  );

  runIf(
    'extractJobs create → wait resolves to a terminal inline result',
    async () => {
      const client = newClient();
      const created = await client.v2.extractJobs.create({
        schema: { type: 'object', properties: { revenue: { type: 'string' } } },
        markdown: SAMPLE_MARKDOWN,
      });
      const done = await client.v2.extractJobs.wait(created.job_id, { timeout: 120_000 });
      expect(done.is_terminal).toBe(true);
      // The job envelope carries a top-level `metadata` receipt only when the result was
      // delivered to an `output_save_url`. This job is inline, so the receipt is `null` and the
      // metadata lives on the result instead.
      expect(done.metadata === null || typeof done.metadata === 'object').toBe(true);
      if (done.status === 'completed' && done.raw['output_url'] == null) {
        expect(done.metadata).toBeNull();
        const result = done.result as LandingAIADE.V2ExtractResult;
        expect(typeof result.metadata.duration_ms).toBe('number');
      }
    },
    180_000,
  );

  runIf(
    'parseJobs create → wait, then list returns a non-empty normalized JobList',
    async () => {
      const client = newClient();
      // Complete a real parse job first so the list assertion below is non-vacuous: an empty page
      // would let a broken list/normalizer pass this release gate. This also gives the suite its
      // only real parse (the staging smoke parses only on the sync route).
      const created = await client.v2.parseJobs.create({
        document: await toFile(pdfBytes, 'sample.pdf', { type: 'application/pdf' }),
      });
      const done = await client.v2.parseJobs.wait(created.job_id, { timeout: 180_000 });
      expect(done.is_terminal).toBe(true);

      const list = await client.v2.parseJobs.list({ page: 0, page_size: 10 });
      expect(list.jobs.length).toBeGreaterThan(0);
      for (const job of list.jobs) {
        expect(typeof job.job_id).toBe('string');
        // The list envelope emits ISO-8601 timestamps; the normalizer maps them to `Date`
        // (or `null` when absent).
        expect(job.created_at === null || job.created_at instanceof Date).toBe(true);
      }
    },
    240_000,
  );
});
