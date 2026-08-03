import { LandingAIADEError } from '../../core/error';
import { type Uploadable } from '../../core/uploads';
import { RequestOptions } from '../../internal/request-options';
import { multipartFormRequestOptions } from '../../internal/uploads';
import { path } from '../../internal/utils/path';
import {
  V2Resource,
  WaitOptions,
  buildJobList,
  cleanQuery,
  jobsFromEnvelope,
  pollUntilTerminal,
} from './_base';
import { normalizeParseJob } from './_normalize';
import { Job, JobList } from './types';

export interface V2ParseParams {
  /** A file to be parsed. Provide either this or `document_url`. */
  document?: Uploadable | null;

  /** URL to the file to be parsed. Provide either this or `document`. */
  document_url?: string | null;

  /** The version of the model to use for parsing. */
  model?: string | null;

  /** Additional parsing options. Sent to the server as a JSON-encoded form field. */
  options?: Record<string, unknown> | string | null;

  /**
   * Encrypted PDFs are not currently supported: providing a password returns a
   * 422. Decrypt the file before uploading. Sent within `options` on the wire.
   */
  password?: string | null;
}

export interface V2ParseJobCreateParams extends V2ParseParams {
  /**
   * If zero data retention (ZDR) is enabled, a URL the parsed output should be
   * saved to instead of being returned in the job result. The completed job
   * then reports `output_url` (in `Job.raw`) instead of an inline `result`, and
   * the parse metadata receipt (billing included) on `Job.metadata`.
   */
  output_save_url?: string | null;

  /**
   * Async service tier. `priority` runs in the fast lane at the sync billing
   * rate; absent → `standard`.
   */
  service_tier?: 'standard' | 'priority' | null;
}

export interface V2JobListParams {
  page?: number;

  page_size?: number;

  status?: string | null;
}

/**
 * Build the multipart form body for parse. `options` is JSON-encoded per the
 * contract; unset (`undefined`/`null`) fields are dropped so they aren't sent.
 */
export function buildParseForm(params: V2ParseJobCreateParams): Record<string, unknown> {
  const { options, password, ...rest } = params;
  const body: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (value !== undefined && value !== null) {
      body[key] = value;
    }
  }
  // The parse request carries `password` inside `options` (encrypted PDFs are
  // unsupported — any value returns 422). Fold the top-level convenience param
  // into the options object, mirroring how `buildExtractBody` folds `strict`.
  let opts = options;
  if (password !== undefined && password !== null) {
    if (opts === undefined || opts === null) {
      opts = { password };
    } else if (typeof opts === 'object') {
      opts = { ...opts, password };
    } else {
      // `options` was pre-serialized as a JSON string; merge into it when it
      // parses as an object, otherwise keep the caller's string and pass the
      // password as a top-level field so it is never silently dropped.
      try {
        opts = { ...(JSON.parse(opts) as Record<string, unknown>), password };
      } catch {
        body['password'] = password;
      }
    }
  }
  if (opts !== undefined && opts !== null) {
    body['options'] = typeof opts === 'string' ? opts : JSON.stringify(opts);
  }
  return body;
}

export class ParseJobs extends V2Resource {
  /**
   * Create an asynchronous parse job against `/v2/parse/jobs`. Returns a
   * normalized `Job` immediately (typically `pending`). Poll with `.get(jobID)`
   * or block until terminal with `.wait(jobID)`.
   */
  async create(body: V2ParseJobCreateParams, options?: RequestOptions): Promise<Job> {
    const raw = await this._client.post<Record<string, unknown>>(
      this.v2Url('/v2/parse/jobs'),
      multipartFormRequestOptions({ body: buildParseForm(body), ...options }, this._client),
    );
    return normalizeParseJob(raw);
  }

  /** Get the current status of an async parse job by `jobID`. */
  async get(jobID: string, options?: RequestOptions): Promise<Job> {
    if (!jobID) {
      throw new LandingAIADEError(
        `Expected a non-empty value for 'jobID' but received ${JSON.stringify(jobID)}`,
      );
    }
    const raw = await this._client.get<Record<string, unknown>>(
      this.v2Url(path`/v2/parse/jobs/${jobID}`),
      options,
    );
    return normalizeParseJob(raw);
  }

  /** List async parse jobs associated with your API key, newest first. */
  async list(query: V2JobListParams = {}, options?: RequestOptions): Promise<JobList> {
    const raw = await this._client.get<Record<string, unknown>>(this.v2Url('/v2/parse/jobs'), {
      query: cleanQuery(query as Record<string, unknown>),
      ...options,
    });
    const jobs = jobsFromEnvelope(raw).map(normalizeParseJob);
    return buildJobList(jobs, raw);
  }

  /** Block, polling `.get(jobID)` with backoff, until the job is terminal. */
  wait(jobID: string, options: WaitOptions = {}): Promise<Job> {
    return pollUntilTerminal(() => this.get(jobID), options);
  }
}
