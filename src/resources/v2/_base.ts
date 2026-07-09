import { APIResource } from '../../core/resource';
import { APIError, JobFailedError, JobWaitTimeoutError, V2SyncTimeoutError } from '../../core/error';
import { Job, JobList } from './types';

export const DEFAULT_POLL_INITIAL_MS = 1000;
export const DEFAULT_POLL_MAX_MS = 10000;
export const DEFAULT_POLL_FACTOR = 1.5;
/** Default `wait()` timeout, in milliseconds (10 minutes). */
export const DEFAULT_WAIT_TIMEOUT_MS = 600000;

/**
 * Shared base for V2 sub-resources, which target the ADE gateway host rather
 * than the V1 host. `buildURL` passes absolute URLs through untouched, so we
 * build an absolute URL against the client's resolved `v2BaseURL` and inherit
 * auth, retries, and the configured fetch.
 */
export abstract class V2Resource extends APIResource {
  protected v2Url(path: string): string {
    return `${this._client.v2BaseURL}${path}`;
  }
}

/** Drop `undefined`/`null` entries so unset params aren't serialized. */
export function cleanQuery(query: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null) {
      out[key] = value;
    }
  }
  return out;
}

export function buildJobList(jobs: Array<Job>, env: Record<string, unknown>): JobList {
  return {
    jobs,
    hasMore: typeof env['has_more'] === 'boolean' ? (env['has_more'] as boolean) : false,
    orgId: typeof env['org_id'] === 'string' ? (env['org_id'] as string) : null,
    page: typeof env['page'] === 'number' ? (env['page'] as number) : null,
    pageSize: typeof env['page_size'] === 'number' ? (env['page_size'] as number) : null,
  };
}

export function jobsFromEnvelope(env: Record<string, unknown>): Array<Record<string, unknown>> {
  const jobs = env['jobs'];
  if (!Array.isArray(jobs)) {
    return [];
  }
  return jobs.filter((job): job is Record<string, unknown> => typeof job === 'object' && job !== null);
}

/** Translate a 504 from a synchronous parse/extract into a `V2SyncTimeoutError`. */
export function throwIfSyncTimeout(err: unknown): void {
  if (err instanceof APIError && err.status === 504) {
    throw new V2SyncTimeoutError(
      'The synchronous request timed out (HTTP 504). The server cancels the work on timeout — ' +
        'use the async jobs route (`client.v2.parseJobs.create(...)` / `client.v2.extractJobs.create(...)`, ' +
        'then `.wait(...)`) for long-running documents.',
    );
  }
}

export interface WaitOptions {
  /** Give up after this many milliseconds. Defaults to 600000 (10 minutes). */
  timeout?: number;

  /** Fixed poll interval in milliseconds. Omit to use exponential backoff. */
  pollInterval?: number;

  /** Throw `JobFailedError` if the job ends failed/cancelled with an error attached. */
  raiseOnFailure?: boolean;
}

/**
 * Injectable clock so tests can drive polling without real time passing.
 * Production callers use the default (wall clock + `setTimeout`).
 */
export interface PollClock {
  now: () => number;
  sleep: (ms: number) => Promise<void>;
}

const REAL_CLOCK: PollClock = {
  now: () => Date.now(),
  sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
};

function nextDelay(current: number, pollInterval: number | undefined): number {
  if (pollInterval !== undefined) {
    return pollInterval;
  }
  return Math.min(current * DEFAULT_POLL_FACTOR, DEFAULT_POLL_MAX_MS);
}

/**
 * Poll `getJob` with backoff until the job reaches a terminal state. Throws
 * `JobWaitTimeoutError` on timeout and (when `raiseOnFailure`) `JobFailedError`
 * if the job ended failed/cancelled with an error attached.
 */
export async function pollUntilTerminal(
  getJob: () => Promise<Job>,
  options: WaitOptions,
  clock: PollClock = REAL_CLOCK,
): Promise<Job> {
  const timeout = options.timeout ?? DEFAULT_WAIT_TIMEOUT_MS;
  const raiseOnFailure = options.raiseOnFailure ?? false;
  const deadline = clock.now() + timeout;
  let delay = options.pollInterval ?? DEFAULT_POLL_INITIAL_MS;

  for (;;) {
    const job = await getJob();
    if (job.isTerminal) {
      if (raiseOnFailure && job.error !== null) {
        throw new JobFailedError(
          `Job ${job.jobId} ended ${job.status}: ${job.error.message || job.error.code || 'unknown error'}`,
        );
      }
      return job;
    }
    if (clock.now() >= deadline) {
      throw new JobWaitTimeoutError(
        `Job ${job.jobId} did not finish within ${timeout}ms (last status: ${job.status}).`,
      );
    }
    await clock.sleep(Math.min(delay, Math.max(0, deadline - clock.now())));
    delay = nextDelay(delay, options.pollInterval);
  }
}
