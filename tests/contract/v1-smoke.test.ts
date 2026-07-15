import LandingAIADE from 'landingai-ade';

// V1 contract smoke test. Unlike the rest of the suite (fully mocked, offline), this hits the
// LIVE staging API, so it is gated on a real key and excluded from the default `./scripts/test`
// run (see jest.config.ts testPathIgnorePatterns). CI runs it only on `spec-sync/*` branches via
// .github/workflows/pr-gates.yml; run it locally with `yarn test:contract`.
const apiKey = process.env['LANDINGAI_ADE_STAGING_APIKEY'];
const runIf = apiKey ? test : test.skip;

describe('V1 contract (staging)', () => {
  runIf(
    'parseJobs.list is reachable on staging (auth + routing sanity)',
    async () => {
      // `environment: 'staging'` selects the V1 host https://api.va.staging.landing.ai.
      const client = new LandingAIADE({ apikey: apiKey!, environment: 'staging' });
      const result = await client.parseJobs.list({ page: 0, pageSize: 1 });
      expect(Array.isArray(result.jobs)).toBe(true);
    },
    30_000,
  );
});
