import LandingAIADE, { toFile } from 'landingai-ade';

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
    'files.upload stages bytes and returns a file_ref',
    async () => {
      const client = new LandingAIADE({ apikey: apiKey!, environment: 'staging' });
      const fileRef = await client.v2.files.upload({
        file: await toFile(Buffer.from(SAMPLE_MARKDOWN), 'doc.md', { type: 'text/markdown' }),
      });
      expect(typeof fileRef).toBe('string');
      expect(fileRef.length).toBeGreaterThan(0);
    },
    60_000,
  );

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
      // Spec-sync moved the credit-charge character counts from `billing` onto
      // the metadata itself; a non-strict extract also surfaces
      // `schema_violation_error` (null when the schema was fully satisfied).
      expect(
        res.metadata.input_markdown_chars == null || typeof res.metadata.input_markdown_chars === 'number',
      ).toBe(true);
      expect(res.schema_violation_error === undefined || res.schema_violation_error === null).toBe(true);
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
