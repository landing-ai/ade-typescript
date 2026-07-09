// Normalize the divergent parse/extract/workflow job envelopes into one `Job`.
//
// The upstream envelopes differ in timestamp encoding (epoch seconds vs ISO
// strings), terminal payload field (`data`/`output_url` vs `result`), and
// failure representation (`failure_reason` string vs `error {code, message}`).

import {
  Job,
  JobError,
  JobStatus,
  V2ExtractResult,
  V2ParseResponse,
  V2WorkflowResult,
  isTerminalStatus,
} from './types';

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

/** Extract job error: an `error {code, message}` object, or a `failure_reason` string (list envelope). */
function isoError(raw: Record<string, unknown>): JobError | null {
  const err = raw['error'];
  if (isRecord(err)) {
    return {
      code: typeof err['code'] === 'string' ? (err['code'] as string) : null,
      message: typeof err['message'] === 'string' ? (err['message'] as string) : null,
    };
  }
  if (raw['failure_reason']) {
    return { code: null, message: String(raw['failure_reason']) };
  }
  return null;
}

/**
 * Shared skeleton for the ISO-timestamp envelopes (extract, workflow), which
 * agree on everything except the concrete `result` payload type.
 */
function baseIsoJob(raw: Record<string, unknown>): Job {
  const status = toStatus(raw['status']);
  return {
    jobId: String(raw['job_id']),
    status,
    createdAt: toDate(raw['created_at']),
    completedAt: toDate(raw['completed_at']),
    progress: toProgress(raw['progress']),
    result: null,
    error: isoError(raw),
    isTerminal: isTerminalStatus(status),
    raw,
  };
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
  const job = baseIsoJob(raw);
  const payload = raw['result'];
  job.result = isRecord(payload) ? (payload as unknown as V2ExtractResult) : null;
  return job;
}

export function normalizeWorkflowJob(raw: Record<string, unknown>): Job {
  const job = baseIsoJob(raw);
  const payload = raw['result'];
  job.result = isRecord(payload) ? (payload as unknown as V2WorkflowResult) : null;
  return job;
}
