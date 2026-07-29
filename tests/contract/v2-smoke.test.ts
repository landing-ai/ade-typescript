import LandingAIADE from 'landingai-ade';

// V2 (`client.v2`) contract smoke test. Like the V1 one, it hits the LIVE staging API — gated on a
// real key, excluded from the default `./scripts/test` run, and required only on `spec-sync/*`
// branches (see .github/workflows/pr-gates.yml). Run locally with `yarn test:contract`.
//
// Two-host reminder: `environment: 'staging'` routes V2 to the API host api.ade.staging.landing.ai
// (NOT the aide gateway, which only serves the spec).
const apiKey = process.env['LANDINGAI_ADE_STAGING_APIKEY'];
const runIf = apiKey ? test : test.skip;

const SAMPLE_MARKDOWN = '# Acme Inc. — Q1 Report\n\nTotal revenue for the quarter was **$1,250,000**.\n';

describe('V2 contract (staging)', () => {
  runIf(
    'extract (sync) returns a structured extraction with range_units metadata',
    async () => {
      const client = new LandingAIADE({ apikey: apiKey!, environment: 'staging' });
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
    60_000,
  );

  runIf(
    'buildSchema (sync) generates an extraction schema string with metadata',
    async () => {
      const client = new LandingAIADE({ apikey: apiKey!, environment: 'staging' });
      const res = await client.v2.buildSchema({
        markdowns: [SAMPLE_MARKDOWN],
        prompt: 'Capture the company name and total revenue.',
      });
      // `extraction_schema` is the generated JSON Schema serialized as a string.
      expect(typeof res.extraction_schema).toBe('string');
      expect(() => JSON.parse(res.extraction_schema)).not.toThrow();
      expect(typeof res.metadata.openapi_spec).toBe('string');
    },
    60_000,
  );

  runIf(
    'buildSchemaJobs.list returns a normalized JobList',
    async () => {
      const client = new LandingAIADE({ apikey: apiKey!, environment: 'staging' });
      const list = await client.v2.buildSchemaJobs.list({ page: 0, page_size: 1 });
      expect(Array.isArray(list.jobs)).toBe(true);
      for (const job of list.jobs) {
        expect(typeof job.job_id).toBe('string');
        expect(job.created_at === null || job.created_at instanceof Date).toBe(true);
      }
    },
    30_000,
  );

  runIf(
    'ground (sync) resolves extracted fields to structure blocks',
    async () => {
      const client = new LandingAIADE({ apikey: apiKey!, environment: 'staging' });
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
    60_000,
  );

  runIf(
    'parseJobs.get normalizes the envelope-level metadata receipt',
    async () => {
      const client = new LandingAIADE({ apikey: apiKey!, environment: 'staging' });
      const list = await client.v2.parseJobs.list({ page: 0, page_size: 5 });
      for (const listed of list.jobs) {
        const job = await client.v2.parseJobs.get(listed.job_id);
        // `metadata` is the receipt (billing included) returned next to
        // `output_url` for jobs created with an `output_save_url`. A smoke test
        // cannot mint a presigned delivery URL, so assert the normalizer's
        // contract on whatever staging returns — an object or `null` — and
        // require it whenever a completed job actually was delivered.
        expect(job.metadata === null || typeof job.metadata === 'object').toBe(true);
        if (job.status === 'completed' && typeof job.raw['output_url'] === 'string') {
          expect(job.metadata).not.toBeNull();
        }
      }
    },
    60_000,
  );

  runIf(
    'parseJobs.list returns a normalized JobList against the new envelope',
    async () => {
      const client = new LandingAIADE({ apikey: apiKey!, environment: 'staging' });
      const list = await client.v2.parseJobs.list({ page: 0, page_size: 1 });
      expect(Array.isArray(list.jobs)).toBe(true);
      for (const job of list.jobs) {
        expect(typeof job.job_id).toBe('string');
        // The list envelope now emits ISO-8601 timestamps; the normalizer maps
        // them to `Date` (or `null` when absent).
        expect(job.created_at === null || job.created_at instanceof Date).toBe(true);
      }
    },
    30_000,
  );
});
