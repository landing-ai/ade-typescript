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
    expect(calls.some((u) => u === 'https://aide.staging.landing.ai/v1/files')).toBe(true);
  });

  test('parse routes to the V2 host and returns a 206 partial result', async () => {
    const { client, calls } = stubClient(() =>
      jsonResponse({ markdown: 'x', metadata: { failed_pages: [2] } }, 206),
    );
    const res = await client.v2.parse({ document: await toFile(Buffer.from('%PDF'), 'a.pdf') });
    expect(res.metadata?.failed_pages).toEqual([2]);
    expect(calls.some((u) => u === 'https://aide.staging.landing.ai/v2/parse')).toBe(true);
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
    expect(calls.some((u) => u === 'https://aide.staging.landing.ai/v2/extract')).toBe(true);
  });

  test('a 504 on a sync call surfaces as V2SyncTimeoutError', async () => {
    const { client } = stubClient(() => new Response('', { status: 504 }));
    await expect(client.v2.extract({ schema: { type: 'object' }, markdown: 'x' })).rejects.toBeInstanceOf(
      V2SyncTimeoutError,
    );
  });

  test('a sync 504 is surfaced immediately without retrying, even at the default maxRetries', async () => {
    let calls = 0;
    const fetch: Fetch = async (input) => {
      if (!String(input).startsWith('data:')) calls++;
      return new Response('', { status: 504 });
    };
    // No maxRetries override here — the sync method must disable retries itself
    // (default is 2, which would otherwise mean 3 doomed attempts).
    const client = new LandingAIADE({ apikey: 'k', environment: 'staging', fetch });
    await expect(client.v2.extract({ schema: { type: 'object' }, markdown: 'x' })).rejects.toBeInstanceOf(
      V2SyncTimeoutError,
    );
    expect(calls).toBe(1);
  });

  test('parseJobs.create normalizes the create envelope', async () => {
    const { client, calls } = stubClient(() => jsonResponse({ job_id: 'pj-1' }, 202));
    const job = await client.v2.parseJobs.create({ document: await toFile(Buffer.from('x'), 'a.pdf') });
    expect(job.job_id).toBe('pj-1');
    expect(job.status).toBe('pending');
    expect(calls.some((u) => u === 'https://aide.staging.landing.ai/v2/parse/jobs')).toBe(true);
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
    expect(job.is_terminal).toBe(true);
    expect(calls.some((u) => u === 'https://aide.staging.landing.ai/v2/extract/jobs/ej-1')).toBe(true);
  });

  test('parseJobs.list builds a JobList with the pagination envelope', async () => {
    const { client } = stubClient(() =>
      jsonResponse({ jobs: [{ job_id: 'a', status: 'pending' }], has_more: true, org_id: 'o' }),
    );
    const list = await client.v2.parseJobs.list({ page: 0, page_size: 10 });
    expect(list.jobs[0]!.job_id).toBe('a');
    expect(list.has_more).toBe(true);
    expect(list.org_id).toBe('o');
  });

  test('extractJobs.create sends service_tier in the JSON body', async () => {
    let sentBody: unknown;
    const fetch: Fetch = async (_input, init) => {
      sentBody = init?.body;
      return jsonResponse({ job_id: 'ej-2' }, 202);
    };
    const client = new LandingAIADE({ apikey: 'k', environment: 'staging', maxRetries: 0, fetch });
    const job = await client.v2.extractJobs.create({
      schema: { type: 'object' },
      markdown: 'hi',
      service_tier: 'priority',
    });
    expect(job.job_id).toBe('ej-2');
    expect(JSON.parse(String(sentBody))).toMatchObject({ service_tier: 'priority' });
  });

  test('workflow (sync) routes to the V2 host and returns output + metadata', async () => {
    const { client, calls } = stubClient(() =>
      jsonResponse({
        output: { 'parse-extract': { extract: { extraction: { revenue: '1M' } } } },
        metadata: { job_id: 'w', duration_ms: 5 },
      }),
    );
    const res = await client.v2.workflow({
      inputs: { report: { document_url: 'https://example.com/r.pdf' } },
      steps: [{ name: 'parse-extract', document: '$inputs.report', schema: { type: 'object' } }],
    });
    expect(res.metadata.job_id).toBe('w');
    expect(calls.some((u) => u === 'https://aide.staging.landing.ai/v2/workflow')).toBe(true);
  });

  test('workflowJobs.create sends service_tier and normalizes the job', async () => {
    let sentBody: unknown;
    const fetch: Fetch = async (_input, init) => {
      sentBody = init?.body;
      return jsonResponse({ job_id: 'wj-1' }, 202);
    };
    const client = new LandingAIADE({ apikey: 'k', environment: 'staging', maxRetries: 0, fetch });
    const job = await client.v2.workflowJobs.create({
      inputs: { report: { document_ref: 'ref-1' } },
      steps: [{ name: 'parse-extract', document: '$inputs.report', schema: { type: 'object' } }],
      service_tier: 'priority',
    });
    expect(job.job_id).toBe('wj-1');
    expect(job.status).toBe('pending');
    expect(JSON.parse(String(sentBody))).toMatchObject({ service_tier: 'priority' });
  });

  test('workflow with a file input sends multipart with the file part', async () => {
    let sentBody: unknown;
    const fetch: Fetch = async (input, init) => {
      if (!String(input).startsWith('data:')) sentBody = init?.body;
      return jsonResponse({ output: {}, metadata: { job_id: 'w2', duration_ms: 1 } });
    };
    const client = new LandingAIADE({ apikey: 'k', environment: 'staging', maxRetries: 0, fetch });
    await client.v2.workflow({
      inputs: { report: { document: await toFile(Buffer.from('%PDF'), 'r.pdf') } },
      steps: [{ name: 'parse-extract', document: '$inputs.report', schema: { type: 'object' } }],
    });
    expect(sentBody).toBeInstanceOf(FormData);
    const form = sentBody as FormData;
    const part = form.get('document_report');
    expect(part).not.toBeNull();
    expect(typeof part).not.toBe('string'); // a binary File part, not a string field
    expect(JSON.parse(String(form.get('inputs')))).toEqual({ report: { document: 'document_report' } });
    expect(typeof form.get('steps')).toBe('string');
  });
});
