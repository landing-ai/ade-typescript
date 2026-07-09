import LandingAIADE from 'landingai-ade';

const APIKEY = 'My Apikey';

// Snapshot and restore the env vars the constructor reads, so these tests are
// deterministic regardless of the ambient environment.
const ENV_KEYS = ['LANDINGAI_ADE_BASE_URL', 'LANDINGAI_ADE_V2_BASE_URL', 'LANDINGAI_ADE_ENVIRONMENT'];
let saved: Record<string, string | undefined> = {};

beforeEach(() => {
  saved = {};
  for (const key of ENV_KEYS) {
    saved[key] = process.env[key];
    delete process.env[key];
  }
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
});

describe('V2 environment / base URL resolution', () => {
  test('default production pair', () => {
    const client = new LandingAIADE({ apikey: APIKEY });
    expect(client.baseURL).toBe('https://api.va.landing.ai');
    expect(client.v2BaseURL).toBe('https://aide.landing.ai');
  });

  test.each([
    ['production', 'https://api.va.landing.ai', 'https://aide.landing.ai'],
    ['eu', 'https://api.va.eu-west-1.landing.ai', 'https://aide.eu-west-1.landing.ai'],
    ['staging', 'https://api.va.staging.landing.ai', 'https://aide.staging.landing.ai'],
    ['dev', 'https://api.va.dev.landing.ai', 'https://aide.dev.landing.ai'],
  ] as const)('environment=%s pairs the V1 and V2 hosts', (environment, v1, v2) => {
    const client = new LandingAIADE({ apikey: APIKEY, environment });
    expect(client.baseURL).toBe(v1);
    expect(client.v2BaseURL).toBe(v2);
  });

  test('environment from LANDINGAI_ADE_ENVIRONMENT env var', () => {
    process.env['LANDINGAI_ADE_ENVIRONMENT'] = 'staging';
    const client = new LandingAIADE({ apikey: APIKEY });
    expect(client.baseURL).toBe('https://api.va.staging.landing.ai');
    expect(client.v2BaseURL).toBe('https://aide.staging.landing.ai');
  });

  test('explicit v2BaseURL wins', () => {
    const client = new LandingAIADE({ apikey: APIKEY, v2BaseURL: 'https://mock.local/' });
    expect(client.v2BaseURL).toBe('https://mock.local');
  });

  test('LANDINGAI_ADE_V2_BASE_URL env var', () => {
    process.env['LANDINGAI_ADE_V2_BASE_URL'] = 'https://v2.mock.local';
    const client = new LandingAIADE({ apikey: APIKEY });
    expect(client.v2BaseURL).toBe('https://v2.mock.local');
  });

  test('V2 follows baseURL when only baseURL is set', () => {
    const client = new LandingAIADE({ apikey: APIKEY, baseURL: 'http://127.0.0.1:4010' });
    expect(client.baseURL).toBe('http://127.0.0.1:4010');
    expect(client.v2BaseURL).toBe('http://127.0.0.1:4010');
  });

  test('explicit baseURL governs V2 even when LANDINGAI_ADE_ENVIRONMENT is set (no host split)', () => {
    process.env['LANDINGAI_ADE_ENVIRONMENT'] = 'staging';
    const client = new LandingAIADE({ apikey: APIKEY, baseURL: 'http://127.0.0.1:4010' });
    expect(client.baseURL).toBe('http://127.0.0.1:4010');
    // Must follow the explicit baseURL, NOT escape to aide.staging.landing.ai.
    expect(client.v2BaseURL).toBe('http://127.0.0.1:4010');
  });

  test('explicit environment beats the LANDINGAI_ADE_V2_BASE_URL env var', () => {
    process.env['LANDINGAI_ADE_V2_BASE_URL'] = 'https://aide.staging.landing.ai';
    const client = new LandingAIADE({ apikey: APIKEY, environment: 'production' });
    expect(client.v2BaseURL).toBe('https://aide.landing.ai');
  });

  test('v2 sub-client exists', () => {
    const client = new LandingAIADE({ apikey: APIKEY });
    expect(client.v2).toBeDefined();
    expect(typeof client.v2.parse).toBe('function');
    expect(typeof client.v2.extract).toBe('function');
    expect(client.v2.files).toBeDefined();
    expect(client.v2.parseJobs).toBeDefined();
    expect(client.v2.extractJobs).toBeDefined();
  });
});
