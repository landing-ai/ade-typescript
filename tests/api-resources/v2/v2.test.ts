import LandingAIADE, { V2SyncTimeoutError, toFile } from 'landingai-ade';
import type { Fetch } from 'landingai-ade/internal/builtin-types';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

/** A client backed by a stub fetch that records request URLs and returns `handler`'s response. */
function stubClient(handler: (url: string) => Response): { client: LandingAIADE; calls: string[] } {
  const calls: string[] = [];
  const fetch: Fetch = async (input) => {
    const url = String(input);
    if (!url.startsWith('data:')) calls.push(url); // ignore the FormData-support probe
    return handler(url);
  };
  const client = new LandingAIADE({ apikey: 'k', environment: 'staging', maxRetries: 0, fetch });
  return { client, calls };
}

describe('client.v2 routing', () => {
  test('files.upload routes to the V2 host and returns file_ref', async () => {
    const { client, calls } = stubClient(() => jsonResponse({ file_ref: 'ref-1' }));
    const ref = await client.v2.files.upload({ file: await toFile(Buffer.from('hi'), 'a.md') });
    expect(ref).toBe('ref-1');
    expect(calls.some((u) => u === 'https://api.ade.staging.landing.ai/v1/files')).toBe(true);
  });

  test('parse routes to the V2 host and returns a 206 partial result', async () => {
    const { client, calls } = stubClient(() =>
      jsonResponse({ markdown: 'x', metadata: { failed_pages: [2] } }, 206),
    );
    const res = await client.v2.parse({ document: await toFile(Buffer.from('%PDF'), 'a.pdf') });
    expect(res.metadata?.failed_pages).toEqual([2]);
    expect(calls.some((u) => u === 'https://api.ade.staging.landing.ai/v2/parse')).toBe(true);
  });

  test('extract sends a JSON body to the V2 host', async () => {
    const { client, calls } = stubClient(() =>
      jsonResponse({
        extraction: { a: 1 },
        extraction_metadata: {},
        markdown: '# doc',
        metadata: { job_id: 'j', version: 'v', duration_ms: 1 },
      }),
    );
    const res = await client.v2.extract({ schema: { type: 'object' }, markdown: 'hi' });
    expect(res.metadata.version).toBe('v');
    expect(calls.some((u) => u === 'https://api.ade.staging.landing.ai/v2/extract')).toBe(true);
  });

  test('a 504 on a sync call surfaces as V2SyncTimeoutError', async () => {
    const { client } = stubClient(() => new Response('', { status: 504 }));
    await expect(client.v2.extract({ schema: { type: 'object' }, markdown: 'x' })).rejects.toBeInstanceOf(
      V2SyncTimeoutError,
    );
  });

  test('parseJobs.create normalizes the create envelope', async () => {
    const { client, calls } = stubClient(() => jsonResponse({ job_id: 'pj-1' }, 202));
    const job = await client.v2.parseJobs.create({ document: await toFile(Buffer.from('x'), 'a.pdf') });
    expect(job.jobId).toBe('pj-1');
    expect(job.status).toBe('pending');
    expect(calls.some((u) => u === 'https://api.ade.staging.landing.ai/v2/parse/jobs')).toBe(true);
  });

  test('extractJobs.get normalizes a completed job', async () => {
    const { client, calls } = stubClient(() =>
      jsonResponse({
        job_id: 'ej-1',
        status: 'completed',
        created_at: '2026-01-02T03:04:05Z',
        result: {
          extraction: {},
          extraction_metadata: {},
          markdown: '',
          metadata: { job_id: 'ej-1', version: 'v', duration_ms: 1 },
        },
      }),
    );
    const job = await client.v2.extractJobs.get('ej-1');
    expect(job.status).toBe('completed');
    expect(job.isTerminal).toBe(true);
    expect(calls.some((u) => u === 'https://api.ade.staging.landing.ai/v2/extract/jobs/ej-1')).toBe(true);
  });

  test('parseJobs.list builds a JobList with the pagination envelope', async () => {
    const { client } = stubClient(() =>
      jsonResponse({ jobs: [{ job_id: 'a', status: 'pending' }], has_more: true, org_id: 'o' }),
    );
    const list = await client.v2.parseJobs.list({ page: 0, page_size: 10 });
    expect(list.jobs[0]!.jobId).toBe('a');
    expect(list.hasMore).toBe(true);
    expect(list.orgId).toBe('o');
  });
});
