import {
  normalizeExtractJob,
  normalizeParseJob,
  normalizeWorkflowJob,
} from 'landingai-ade/resources/v2/_normalize';

describe('normalizeParseJob', () => {
  test('epoch timestamps + inline data', () => {
    const job = normalizeParseJob({
      job_id: 'p1',
      status: 'completed',
      received_at: 1_700_000_000,
      created_at: 1_700_000_005,
      progress: 1.0,
      org_id: 'o1',
      output_url: null,
      data: { markdown: '# hi', metadata: { job_id: 'p1', page_count: 1 } },
    });
    expect(job.job_id).toBe('p1');
    expect(job.status).toBe('completed');
    expect(job.is_terminal).toBe(true);
    expect(job.created_at?.getUTCFullYear()).toBe(2023);
    expect((job.result as any)?.markdown).toBe('# hi');
    expect(job.error).toBeNull();
    expect(job.raw['org_id']).toBe('o1'); // envelope-only fields preserved
  });

  test('epoch-zero created_at is preserved (not treated as missing)', () => {
    const job = normalizeParseJob({ job_id: 'p', status: 'pending', created_at: 0, received_at: 123 });
    expect(job.created_at).not.toBeNull();
    expect(job.created_at?.getTime()).toBe(0); // 1970-01-01, not the received_at fallback
  });

  test('failure_reason maps to error.message', () => {
    const job = normalizeParseJob({
      job_id: 'p2',
      status: 'failed',
      failure_reason: 'bad pdf',
      created_at: 1,
    });
    expect(job.status).toBe('failed');
    expect(job.error?.message).toBe('bad pdf');
    expect(job.result).toBeNull();
  });

  test('minimal create envelope defaults to pending', () => {
    const job = normalizeParseJob({ job_id: 'parse-x' });
    expect(job.job_id).toBe('parse-x');
    expect(job.status).toBe('pending');
    expect(job.is_terminal).toBe(false);
    expect(job.result).toBeNull();
  });

  test('envelope metadata is surfaced for a delivered (output_save_url) job', () => {
    const job = normalizeParseJob({
      job_id: 'p3',
      status: 'completed',
      created_at: '2026-01-02T03:04:05Z',
      output_url: 'https://example.com/delivered.json',
      result: null,
      metadata: { job_id: 'p3', page_count: 2, duration_ms: 7 },
    });
    expect(job.result).toBeNull(); // delivered out-of-band
    expect((job.metadata as any)?.page_count).toBe(2);
  });

  test('envelope metadata is null for an inline job', () => {
    const job = normalizeParseJob({
      job_id: 'p4',
      status: 'completed',
      result: { markdown: '# hi', metadata: { duration_ms: 1 } },
    });
    expect(job.metadata).toBeNull();
  });

  test('unknown status defaults to pending but preserves raw', () => {
    const job = normalizeParseJob({ job_id: 'p', status: 'some_brand_new_status' });
    expect(job.status).toBe('pending');
    expect(job.raw['status']).toBe('some_brand_new_status');
  });
});

describe('normalizeExtractJob', () => {
  test('ISO timestamps + result', () => {
    const job = normalizeExtractJob({
      job_id: 'e1',
      status: 'completed',
      created_at: '2026-01-02T03:04:05Z',
      completed_at: '2026-01-02T03:04:09Z',
      result: {
        extraction: { revenue: '1M' },
        extraction_metadata: { revenue: { value: '1M', spans: [] } },
        markdown: '# doc',
        metadata: { job_id: 'e1', version: 'extract-1', duration_ms: 10 },
      },
    });
    expect(job.status).toBe('completed');
    expect(job.created_at?.getUTCFullYear()).toBe(2026);
    expect(job.completed_at).not.toBeNull();
    expect((job.result as any)?.metadata.version).toBe('extract-1');
  });

  test('error object maps to code + message', () => {
    const job = normalizeExtractJob({
      job_id: 'e2',
      status: 'failed',
      error: { code: 'internal_error', message: 'boom' },
    });
    expect(job.status).toBe('failed');
    expect(job.error?.code).toBe('internal_error');
    expect(job.error?.message).toBe('boom');
  });

  test('list envelope failure_reason maps to error.message', () => {
    const job = normalizeExtractJob({ job_id: 'e3', status: 'failed', failure_reason: 'nope' });
    expect(job.error?.message).toBe('nope');
  });

  test('envelope metadata is surfaced for a delivered (output_save_url) job', () => {
    const job = normalizeExtractJob({
      job_id: 'e4',
      status: 'completed',
      created_at: '2026-01-02T03:04:05Z',
      output_url: 'https://example.com/delivered.json',
      result: null,
      metadata: { job_id: 'e4', version: 'v', duration_ms: 9, billing: { total_credits: 1 } },
    });
    expect(job.result).toBeNull(); // delivered out-of-band
    expect((job.metadata as any)?.billing.total_credits).toBe(1);
  });

  test('envelope metadata is null for an inline job', () => {
    const job = normalizeExtractJob({
      job_id: 'e5',
      status: 'completed',
      result: {
        extraction: {},
        extraction_metadata: {},
        markdown: '',
        metadata: { job_id: 'e5', version: 'v', duration_ms: 1 },
      },
    });
    expect(job.metadata).toBeNull();
  });
});

describe('normalizeWorkflowJob', () => {
  test('ISO timestamps + workflow result (output + metadata)', () => {
    const job = normalizeWorkflowJob({
      job_id: 'w1',
      status: 'completed',
      created_at: '2026-01-02T03:04:05Z',
      completed_at: '2026-01-02T03:04:20Z',
      result: {
        output: { 'parse-extract': { extract: { extraction: { revenue: '1M' } } } },
        metadata: { job_id: 'w1', duration_ms: 100 },
      },
    });
    expect(job.status).toBe('completed');
    expect(job.is_terminal).toBe(true);
    expect(job.completed_at).not.toBeNull();
    expect((job.result as any)?.output['parse-extract'].extract.extraction.revenue).toBe('1M');
  });

  test('error object maps to code + message', () => {
    const job = normalizeWorkflowJob({
      job_id: 'w2',
      status: 'failed',
      error: { code: 'boom', message: 'x' },
    });
    expect(job.error?.code).toBe('boom');
  });
});
