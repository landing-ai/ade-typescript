// Client identity headers — User-Agent + X-Source (landing-ai/ade-typescript#96).
import LandingAIADE from 'landingai-ade';
import { SOURCE, buildUserAgent } from 'landingai-ade/internal/client-identity';

const client = new LandingAIADE({ baseURL: 'http://localhost:5000/', apikey: 'My Apikey' });

// Endpoints spanning the operations in the issue: parse, extract, and job
// submit (POST .../jobs) + poll (GET .../jobs/{id}).
const ENDPOINTS: Array<[string, 'get' | 'post']> = [
  ['/v1/ade/parse', 'post'],
  ['/v1/ade/extract', 'post'],
  ['/v1/ade/parse/jobs', 'post'], // submit
  ['/v1/ade/parse/jobs/job_123', 'get'], // poll
  ['/v1/ade/extract/jobs', 'post'], // submit
  ['/v1/ade/extract/jobs/job_123', 'get'], // poll
];

/**
 * Faithful port of vision-agent-ui's `parseUserAgent.ts` (the platform parser),
 * kept in lockstep so these tests fail if our User-Agent drifts from the shape
 * the platform actually reads.
 */
function parseUserAgent(raw: string): Record<string, string> {
  const analysis: Record<string, string> = { raw };

  const comment = /\(([^)]*)\)/.exec(raw);
  let tokens: string[];
  if (comment) {
    const inner = comment[1] ?? '';
    const parts = inner.trim().split(/\s+/);
    if (parts.length === 2 && !/[;,]/.test(inner)) {
      analysis['os'] = parts[0]!;
      analysis['arch'] = parts[1]!;
    }
    tokens = raw.replace(comment[0]!, ' ').trim().split(/\s+/);
  } else {
    tokens = raw.trim().split(/\s+/);
  }

  const [product, ...rest] = tokens;
  const productMatch = /^([^/]+)\/(.+)$/.exec(product ?? '');
  if (productMatch) {
    analysis['product'] = productMatch[1]!;
    analysis['productVersion'] = productMatch[2]!;
  }

  const reserved = new Set(['raw', 'product', 'productVersion', 'os', 'arch']);
  for (const token of rest) {
    const slash = token.indexOf('/');
    if (slash <= 0 || slash === token.length - 1) continue;
    const key = token.slice(0, slash);
    if (reserved.has(key) || analysis[key] !== undefined) continue;
    analysis[key] = token.slice(slash + 1);
  }

  return analysis;
}

describe('User-Agent grammar', () => {
  test('parses per platform contract', () => {
    const parsed = parseUserAgent(buildUserAgent('2.10.0'));
    expect(parsed['product']).toBe('ade-typescript');
    expect(parsed['productVersion']).toBe('2.10.0');
    // The `(<os> <arch>)` comment fills both dimensions.
    expect(parsed['os']).toBeTruthy();
    expect(parsed['arch']).toBeTruthy();
    // Runtime key/value token — tests run on Node, so `node/<major>` is present.
    expect(parsed['node']).toBeTruthy();
  });

  test('platform comment shape', () => {
    // Exactly two space-separated words, no `;`/`,` — the only shape the
    // platform parser reads into os/arch.
    const comment = /\(([^)]*)\)/.exec(buildUserAgent('x'));
    expect(comment).not.toBeNull();
    const inner = comment![1]!;
    expect(inner).not.toMatch(/[;,]/);
    expect(inner.trim().split(/\s+/)).toHaveLength(2);
  });
});

describe('X-Source', () => {
  test('is the sdk source', () => {
    expect(SOURCE).toBe('sdk');
  });
});

describe('every request carries identity', () => {
  test.each(ENDPOINTS)('%s %s', async (path, method) => {
    const { req } = await client.buildRequest({ path, method });
    expect(req.headers.get('x-source')).toBe('sdk');
    expect(req.headers.get('user-agent')).toMatch(/^ade-typescript\//);
  });
});

describe('caller override', () => {
  test('default is the sdk identity', async () => {
    const { req } = await client.buildRequest({ path: '/v1/ade/parse', method: 'post' });
    expect(req.headers.get('x-source')).toBe('sdk');
    expect(req.headers.get('user-agent')).toMatch(/^ade-typescript\//);
  });

  test('a caller-supplied default header overrides (documented)', async () => {
    const overridden = new LandingAIADE({
      baseURL: 'http://localhost:5000/',
      apikey: 'My Apikey',
      defaultHeaders: { 'X-Source': 'myapp' },
    });
    const { req } = await overridden.buildRequest({ path: '/v1/ade/parse', method: 'post' });
    expect(req.headers.get('x-source')).toBe('myapp');
  });

  test('a per-request header overrides (documented)', async () => {
    const { req } = await client.buildRequest({
      path: '/v1/ade/parse',
      method: 'post',
      headers: { 'X-Source': 'per-request' },
    });
    expect(req.headers.get('x-source')).toBe('per-request');
  });
});

describe('never throws', () => {
  test('version degrades to unknown', () => {
    expect(buildUserAgent('')).toMatch(/^ade-typescript\/unknown /);
  });

  test('platform detection failure degrades', () => {
    jest.isolateModules(() => {
      jest.doMock('landingai-ade/internal/detect-platform', () => ({
        getPlatformHeaders: () => {
          throw new Error('boom');
        },
      }));
      const { buildUserAgent: build } = require('landingai-ade/internal/client-identity');
      const ua: string = build('9.9.9');
      expect(ua.startsWith('ade-typescript/9.9.9')).toBe(true);
      expect(ua).toContain('(unknown unknown)');
      expect(ua).toContain('unknown/unknown');
    });
    jest.dontMock('landingai-ade/internal/detect-platform');
  });

  test('exotic platform values stay a valid two-word comment', () => {
    jest.isolateModules(() => {
      jest.doMock('landingai-ade/internal/detect-platform', () => ({
        getPlatformHeaders: () => ({
          'X-Stainless-OS': 'Other:weird os name', // contains spaces
          'X-Stainless-Arch': '', // empty
          'X-Stainless-Runtime': 'browser:chrome',
          'X-Stainless-Runtime-Version': 'no-digits',
        }),
      }));
      const { buildUserAgent: build } = require('landingai-ade/internal/client-identity');
      const ua: string = build('1.2.3');
      const inner = /\(([^)]*)\)/.exec(ua)![1]!;
      expect(inner).not.toMatch(/[;,]/);
      expect(inner.trim().split(/\s+/)).toHaveLength(2); // spaces in OS collapsed, empty arch -> unknown
      expect(ua).toContain('browser/unknown'); // subtype collapsed, no digits -> unknown
    });
    jest.dontMock('landingai-ade/internal/detect-platform');
  });
});
