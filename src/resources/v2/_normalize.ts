// Normalize the divergent parse/extract job envelopes into one `Job` shape.
//
// The two upstream envelopes differ in timestamp encoding (epoch seconds vs ISO
// strings), terminal payload field (`data`/`output_url` vs `result`), and
// failure representation (`failure_reason` string vs `error {code, message}`).

import { Job, JobError, JobStatus, V2ExtractResult, V2ParseResponse, isTerminalStatus } from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Parse an epoch-seconds number or an ISO string into a Date; `null` on failure. */
function toDate(value: unknown): Date | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'number') {
    // Epoch is in seconds (e.g. 1_700_000_000 -> 2023); 0 is a valid instant,
    // not "missing", so it must round-trip to 1970-01-01T00:00:00Z.
    const date = new Date(value * 1000);
    return isNaN(date.getTime()) ? null : date;
  }
  if (typeof value === 'string') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }
  return null;
}

function toProgress(value: unknown): number | null {
  return typeof value === 'number' ? value : null;
}

function toStatus(value: unknown): JobStatus {
  // Unknown/renamed status from the gateway must not crash the normalizer; the
  // original raw status is still available via `job.raw`.
  if (
    value === 'pending' ||
    value === 'processing' ||
    value === 'completed' ||
    value === 'failed' ||
    value === 'cancelled'
  ) {
    return value;
  }
  return 'pending';
}

export function normalizeParseJob(raw: Record<string, unknown>): Job {
  const status = toStatus(raw['status']);
  const data = raw['data'];
  const result = isRecord(data) ? (data as V2ParseResponse) : null;

  let error: JobError | null = null;
  const reason = raw['failure_reason'];
  if (reason) {
    error = { code: null, message: String(reason) };
  }

  // Prefer `created_at`; fall back to `received_at`. Use `??` (not truthiness)
  // so an epoch-zero `created_at` is preserved rather than falling through.
  const created = raw['created_at'] ?? raw['received_at'];

  return {
    jobId: String(raw['job_id']),
    status,
    createdAt: toDate(created),
    completedAt: null, // the parse envelope has no completed_at
    progress: toProgress(raw['progress']),
    result,
    error,
    isTerminal: isTerminalStatus(status),
    raw,
  };
}

export function normalizeExtractJob(raw: Record<string, unknown>): Job {
  const status = toStatus(raw['status']);
  const payload = raw['result'];
  const result = isRecord(payload) ? (payload as unknown as V2ExtractResult) : null;

  let error: JobError | null = null;
  const err = raw['error'];
  if (isRecord(err)) {
    error = {
      code: typeof err['code'] === 'string' ? (err['code'] as string) : null,
      message: typeof err['message'] === 'string' ? (err['message'] as string) : null,
    };
  } else if (raw['failure_reason']) {
    // The extract *list* envelope uses failure_reason instead of error{}.
    error = { code: null, message: String(raw['failure_reason']) };
  }

  return {
    jobId: String(raw['job_id']),
    status,
    createdAt: toDate(raw['created_at']),
    completedAt: toDate(raw['completed_at']),
    progress: toProgress(raw['progress']),
    result,
    error,
    isTerminal: isTerminalStatus(status),
    raw,
  };
}
