import { LandingAIADEError } from '../../core/error';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';
import { ExtractSchema, coerceSchema } from '../../lib/schema';
import { V2Resource, WaitOptions, buildJobList, jobsFromEnvelope, pollUntilTerminal } from './_base';
import { normalizeExtractJob } from './_normalize';
import { V2JobListParams, buildJobListQuery } from './parse';
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

  /**
   * If `false`, skip the grounding stage: every `extraction_metadata` leaf comes
   * back with `ranges: null` and the request finishes faster. Defaults to `true`
   * server-side. Sent as `options.grounding`. Preview — with grounding off the
   * `extraction` itself can differ slightly from a grounded run (empty leaves are
   * not nulled and all-empty array rows are not dropped).
   */
  grounding?: boolean | null;
}

export interface V2ExtractJobCreateParams extends V2ExtractParams {
  /**
   * Async service tier. `priority` runs in the fast lane at the sync billing
   * rate; absent → `standard`.
   */
  service_tier?: 'standard' | 'priority' | null;

  /**
   * URL to save the result to — e.g. a presigned S3 PUT URL. Async jobs only.
   * When set, the finished result is delivered (HTTP PUT) to this URL and the
   * completed job reports `output_url` (in `Job.raw`) instead of an inline
   * `result` — the metadata receipt (billing included) still comes back on
   * `Job.metadata`. Must be a public http(s) URL; private/loopback IPs are
   * rejected at submit time.
   *
   * A presigned URL must stay valid until the job *completes*, not just past
   * submit: an already-expired presign, or one with less than 15 minutes of
   * validity remaining (the default floor — the 422 names the exact window
   * required), is rejected at submit. Sign with credentials that outlive the
   * expected job duration; a URL signed with temporary (assumed-role/session)
   * credentials dies when that session expires, whatever its stated expiry.
   */
  output_save_url?: string | null;
}

export function buildExtractBody(params: V2ExtractJobCreateParams): Record<string, unknown> {
  const body: Record<string, unknown> = { schema: coerceSchema(params.schema) };
  const entries: Array<[string, unknown]> = [
    ['markdown', params.markdown],
    ['markdown_url', params.markdown_url],
    ['model', params.model],
    ['service_tier', params.service_tier],
    ['output_save_url', params.output_save_url],
  ];
  for (const [key, value] of entries) {
    if (value !== undefined && value !== null) {
      body[key] = value;
    }
  }
  // `strict` and `grounding` are hand-written top-level shorthands that both fold into
  // the SAME nested `options` object (CONTRIBUTING.md -> "V2 request fields"), so they
  // are collected and attached once: assigning `body['options']` per shorthand would
  // drop whichever landed first. `options` is `additionalProperties: false` upstream,
  // so nothing beyond these two may ride along. An absent or `null` value leaves the
  // key out entirely and the server default applies (`strict` false, `grounding` true)
  // -- `Boolean()` rather than truthiness so an explicit `false` is sent, not dropped.
  const options: Record<string, boolean> = {};
  for (const [key, value] of [
    ['strict', params.strict],
    ['grounding', params.grounding],
  ] as const) {
    if (value !== undefined && value !== null) {
      options[key] = Boolean(value);
    }
  }
  if (Object.keys(options).length > 0) {
    body['options'] = options;
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

  /**
   * List async extract jobs associated with your API key, newest first. A
   * listed job can report `cancelled` alongside the statuses parse listings
   * already use.
   */
  async list(query: V2JobListParams = {}, options?: RequestOptions): Promise<JobList> {
    const raw = await this._client.get<Record<string, unknown>>(this.v2Url('/v2/extract/jobs'), {
      query: buildJobListQuery(query),
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
