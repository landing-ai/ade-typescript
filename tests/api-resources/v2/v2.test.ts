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

  test('a sync 504 is capped at one retry (below the client default), then surfaces as V2SyncTimeoutError', async () => {
    let calls = 0;
    const fetch: Fetch = async (input) => {
      if (!String(input).startsWith('data:')) calls++;
      return new Response('', { status: 504 });
    };
    // No maxRetries override here — the sync method caps retries at 1 itself
    // (client default is 2, which would otherwise mean 3 doomed attempts).
    const client = new LandingAIADE({ apikey: 'k', environment: 'staging', fetch });
    await expect(client.v2.extract({ schema: { type: 'object' }, markdown: 'x' })).rejects.toBeInstanceOf(
      V2SyncTimeoutError,
    );
    expect(calls).toBe(2); // 1 initial attempt + 1 retry
  });

  test('parseJobs.create normalizes the create envelope', async () => {
    const { client, calls } = stubClient(() => jsonResponse({ job_id: 'pj-1' }, 202));
    const job = await client.v2.parseJobs.create({ document: await toFile(Buffer.from('x'), 'a.pdf') });
    expect(job.job_id).toBe('pj-1');
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
    expect(job.is_terminal).toBe(true);
    expect(calls.some((u) => u === 'https://api.ade.staging.landing.ai/v2/extract/jobs/ej-1')).toBe(true);
  });

  test('parse (sync) surfaces inline grounding and the new metadata fields', async () => {
    const box = { xmin: 0, ymin: 0, xmax: 1, ymax: 1 };
    const grounding = { page: 1, range: { start: 0, end: 5 }, box };
    const { client } = stubClient(() =>
      jsonResponse({
        markdown: '# doc',
        structure: {
          type: 'document',
          markdown: '# doc',
          children: [
            {
              type: 'page',
              grounding,
              markdown: '# doc',
              children: [
                {
                  type: 'text',
                  id: 'text-0',
                  grounding,
                  atomic_grounding: [grounding],
                  markdown: '# doc',
                },
              ],
            },
          ],
        },
        metadata: {
          output_markdown_chars: 5,
          range_units: 'unicode_codepoints',
          openapi_spec: 'https://example.com/spec.json',
          failed_pages: [],
        },
      }),
    );
    const res = await client.v2.parse({ document: await toFile(Buffer.from('%PDF'), 'a.pdf') });
    const page = res.structure?.children?.[0];
    expect(page?.grounding?.page).toBe(1);
    expect(page?.grounding?.box.xmax).toBe(1);
    const el = page?.children?.[0];
    expect(el?.grounding?.range).toEqual({ start: 0, end: 5 });
    expect(el?.atomic_grounding?.[0]?.box.ymax).toBe(1);
    expect(res.metadata?.output_markdown_chars).toBe(5);
    expect(res.metadata?.range_units).toBe('unicode_codepoints');
    expect(res.metadata?.openapi_spec).toBe('https://example.com/spec.json');
  });

  test('extract (sync) surfaces model_version, output_ref, and billing counts', async () => {
    const { client } = stubClient(() =>
      jsonResponse({
        extraction: { a: 1 },
        extraction_metadata: {},
        markdown: '# doc',
        output_ref: null,
        metadata: {
          job_id: 'j',
          version: 'v',
          model_version: 'dpt-3-pro-20260710',
          duration_ms: 1,
          range_units: 'unicode_codepoints',
          openapi_spec: 'https://example.com/spec.json',
          billing: { input_markdown_chars: 10, output_extraction_chars: 4 },
        },
      }),
    );
    const res = await client.v2.extract({ schema: { type: 'object' }, markdown: 'hi' });
    expect(res.metadata.model_version).toBe('dpt-3-pro-20260710');
    expect(res.output_ref).toBeNull();
    expect(res.metadata.range_units).toBe('unicode_codepoints');
    expect(res.metadata.billing?.input_markdown_chars).toBe(10);
    expect(res.metadata.billing?.output_extraction_chars).toBe(4);
  });

  test('parse folds the password convenience param into options', async () => {
    let sentBody: unknown;
    const fetch: Fetch = async (input, init) => {
      if (!String(input).startsWith('data:')) sentBody = init?.body;
      return jsonResponse({ markdown: 'x', metadata: {} });
    };
    const client = new LandingAIADE({ apikey: 'k', environment: 'staging', maxRetries: 0, fetch });
    await client.v2.parse({
      document: await toFile(Buffer.from('%PDF'), 'a.pdf'),
      options: { inline_markdown: true },
      password: 'hunter2',
    });
    const form = sentBody as FormData;
    expect(JSON.parse(String(form.get('options')))).toEqual({ inline_markdown: true, password: 'hunter2' });
    expect(form.get('password')).toBeNull(); // no longer sent as a top-level field
  });

  test('parseJobs.get normalizes the new result/error/completed_at envelope', async () => {
    const { client } = stubClient(() =>
      jsonResponse({
        job_id: 'pj-9',
        status: 'completed',
        created_at: '2026-01-02T03:04:05Z',
        completed_at: '2026-01-02T03:05:06Z',
        result: {
          markdown: 'hi',
          metadata: { output_markdown_chars: 2, range_units: 'unicode_codepoints' },
        },
      }),
    );
    const job = await client.v2.parseJobs.get('pj-9');
    expect(job.status).toBe('completed');
    expect(job.is_terminal).toBe(true);
    expect(job.completed_at?.toISOString()).toBe('2026-01-02T03:05:06.000Z');
    const result = job.result as LandingAIADE.V2ParseResponse;
    expect(result.metadata?.output_markdown_chars).toBe(2);
    expect(result.metadata?.range_units).toBe('unicode_codepoints');
  });

  test('parseJobs.get maps a failed job error object', async () => {
    const { client } = stubClient(() =>
      jsonResponse({ job_id: 'pj-f', status: 'failed', error: { code: 'bad', message: 'nope' } }),
    );
    const job = await client.v2.parseJobs.get('pj-f');
    expect(job.status).toBe('failed');
    expect(job.error).toEqual({ code: 'bad', message: 'nope' });
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

  test('extractJobs.create sends output_save_url in the JSON body', async () => {
    let sentBody: unknown;
    const fetch: Fetch = async (_input, init) => {
      sentBody = init?.body;
      return jsonResponse({ job_id: 'ej-3' }, 202);
    };
    const client = new LandingAIADE({ apikey: 'k', environment: 'staging', maxRetries: 0, fetch });
    const job = await client.v2.extractJobs.create({
      schema: { type: 'object' },
      markdown: 'hi',
      output_save_url: 'https://example.com/put',
    });
    expect(job.job_id).toBe('ej-3');
    expect(JSON.parse(String(sentBody))).toMatchObject({ output_save_url: 'https://example.com/put' });
  });

  test('extract (sync) surfaces schema_violation_error, warnings, and the moved billing counts', async () => {
    const { client } = stubClient(() =>
      jsonResponse({
        extraction: { a: 1 },
        extraction_metadata: {},
        markdown: '# doc',
        schema_violation_error: 'field `total` could not be extracted',
        warnings: [{ code: 'partial', message: 'skipped a field' }],
        metadata: {
          job_id: 'j',
          version: 'v',
          model_version: 'dpt-3-pro-20260710',
          duration_ms: 1,
          input_markdown_chars: 10,
          output_extraction_chars: 4,
        },
      }),
    );
    const res = await client.v2.extract({ schema: { type: 'object' }, markdown: 'hi' });
    expect(res.schema_violation_error).toBe('field `total` could not be extracted');
    expect(res.warnings?.[0]).toEqual({ code: 'partial', message: 'skipped a field' });
    // Spec moved these two counts from `billing` onto the metadata itself.
    expect(res.metadata.input_markdown_chars).toBe(10);
    expect(res.metadata.output_extraction_chars).toBe(4);
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
    expect(calls.some((u) => u === 'https://api.ade.staging.landing.ai/v2/workflow')).toBe(true);
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
