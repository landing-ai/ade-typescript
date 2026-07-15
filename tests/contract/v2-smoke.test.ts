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
    'extract (sync) returns a structured extraction',
    async () => {
      const client = new LandingAIADE({ apikey: apiKey!, environment: 'staging' });
      const res = await client.v2.extract({
        schema: { type: 'object', properties: { revenue: { type: 'string' } } },
        markdown: SAMPLE_MARKDOWN,
      });
      expect(res.extraction).toBeDefined();
    },
    60_000,
  );
});
