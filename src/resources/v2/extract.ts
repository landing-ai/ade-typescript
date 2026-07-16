import { LandingAIADEError } from '../../core/error';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';
import { ExtractSchema, coerceSchema } from '../../lib/schema';
import {
  V2Resource,
  WaitOptions,
  buildJobList,
  cleanQuery,
  jobsFromEnvelope,
  pollUntilTerminal,
} from './_base';
import { normalizeExtractJob } from './_normalize';
import { V2JobListParams } from './parse';
import { Job, JobList } from './types';

export interface V2ExtractParams {
  /**
   * JSON schema for field extraction. Accepts a JSON-Schema object or a
   * JSON-encoded string; it is coerced to a JSON object and sent as `schema`.
   */
  schema: ExtractSchema;

  /** Markdown content to extract data from. */
  markdown?: string | null;

  /** URL to the markdown file to extract data from. */
  markdown_url?: string | null;

  /** The version of the model to use for extraction. */
  model?: string | null;

  /**
   * If `true`, reject schemas with unsupported fields (HTTP 422). If `false`,
   * prune unsupported fields and continue. Sent as `options.strict`.
   */
  strict?: boolean | null;
}

export interface V2ExtractJobCreateParams extends V2ExtractParams {
  /**
   * URL to save the result to — e.g. a presigned S3 PUT URL. Async jobs only.
   * When set, the finished result is delivered (HTTP PUT) to this URL and the
   * completed job reports `output_url` (on `Job.raw`) instead of an inline
   * `result`. Must be a public http(s) URL; private/loopback IPs are rejected at
   * submit time.
   */
  output_save_url?: string | null;

  /**
   * Async service tier. `priority` runs in the fast lane at the sync billing
   * rate; absent → `standard`.
   */
  service_tier?: 'standard' | 'priority' | null;
}

export function buildExtractBody(params: V2ExtractJobCreateParams): Record<string, unknown> {
  const body: Record<string, unknown> = { schema: coerceSchema(params.schema) };
  const entries: Array<[string, unknown]> = [
    ['markdown', params.markdown],
    ['markdown_url', params.markdown_url],
    ['model', params.model],
    ['output_save_url', params.output_save_url],
    ['service_tier', params.service_tier],
  ];
  for (const [key, value] of entries) {
    if (value !== undefined && value !== null) {
      body[key] = value;
    }
  }
  if (params.strict !== undefined && params.strict !== null) {
    body['options'] = { strict: Boolean(params.strict) };
  }
  return body;
}

export class ExtractJobs extends V2Resource {
  /**
   * Create an asynchronous extract job against `/v2/extract/jobs`. Returns a
   * normalized `Job` immediately (typically `pending`). Poll with `.get(jobID)`
   * or block until terminal with `.wait(jobID)`.
   */
  async create(body: V2ExtractJobCreateParams, options?: RequestOptions): Promise<Job> {
    const raw = await this._client.post<Record<string, unknown>>(this.v2Url('/v2/extract/jobs'), {
      body: buildExtractBody(body),
      ...options,
    });
    return normalizeExtractJob(raw);
  }

  /** Get the current status of an async extract job by `jobID`. */
  async get(jobID: string, options?: RequestOptions): Promise<Job> {
    if (!jobID) {
      throw new LandingAIADEError(
        `Expected a non-empty value for 'jobID' but received ${JSON.stringify(jobID)}`,
      );
    }
    const raw = await this._client.get<Record<string, unknown>>(
      this.v2Url(path`/v2/extract/jobs/${jobID}`),
      options,
    );
    return normalizeExtractJob(raw);
  }

  /** List async extract jobs associated with your API key, newest first. */
  async list(query: V2JobListParams = {}, options?: RequestOptions): Promise<JobList> {
    const raw = await this._client.get<Record<string, unknown>>(this.v2Url('/v2/extract/jobs'), {
      query: cleanQuery(query as Record<string, unknown>),
      ...options,
    });
    const jobs = jobsFromEnvelope(raw).map(normalizeExtractJob);
    return buildJobList(jobs, raw);
  }

  /** Block, polling `.get(jobID)` with backoff, until the job is terminal. */
  wait(jobID: string, options: WaitOptions = {}): Promise<Job> {
    return pollUntilTerminal(() => this.get(jobID), options);
  }
}
