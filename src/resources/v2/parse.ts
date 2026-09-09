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

  /**
   * The DPT-3 model snapshot to use for parsing. Accepts a dated snapshot (for
   * example, `dpt-3-pro-20260710`), a `-latest` alias, or a bare family name
   * (equivalent to that family's `-latest`). Two families are available:
   * `dpt-3-pro` for highest quality, and `dpt-3-verity` for lower-latency parsing
   * without vision-model captioning. Defaults to the latest DPT-3 Pro snapshot.
   */
  model?: string | null;

  /**
   * Additional parsing options. Sent to the server as a JSON-encoded form field.
   * Must be an object, or a JSON string that decodes to one -- anything else
   * throws `LandingAIADEError` before the request is sent.
   */
  options?: Record<string, unknown> | string | null;

  /**
   * Password for an encrypted PDF. The document is decrypted once at the start
   * of processing, and the password is not retained with the result. PDFs only:
   * supplying one for an image or an Office document returns a 422
   * (`password_unsupported_content_type`). A wrong password returns a 422
   * (`encrypted_pdf_wrong_password`), and omitting one for a locked PDF returns
   * a 422 (`encrypted_pdf_password_required`). Sent on the wire as
   * `options.password` and only there -- this is shorthand for that contract
   * field, so an explicit `options.password` takes precedence over it.
   */
  password?: string | null;
}

export interface V2ParseJobCreateParams extends V2ParseParams {
  /**
   * If zero data retention (ZDR) is enabled, a URL the parsed output should be
   * saved to instead of being returned in the job result. The completed job
   * then reports `output_url` (in `Job.raw`) instead of an inline `result`, and
   * the parse metadata receipt (billing included) on `Job.metadata`.
   *
   * A presigned URL must stay valid until the job *completes*, not just past
   * submit: an already-expired URL, or one whose remaining validity is too
   * short for the document's page count, is rejected at submit (422). By
   * default the URL must retain at least 15 minutes of validity at submit, plus
   * 3 seconds per document page; the 422 message names the exact window
   * required. Sign with credentials that outlive the expected job duration; a
   * URL signed with temporary (assumed-role/session) credentials dies when that
   * session expires, whatever its stated expiry.
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
 * Coerce an accepted `options` value into a plain object. The contract sends
 * `options` as a JSON object, so anything that does not decode to one is a
 * caller mistake -- name the field here instead of leaving the gateway to
 * reject the request without naming it. Mirrors `coerceSchema` in
 * `src/lib/schema.ts`, which does the same job for `schema`.
 */
function coerceOptions(options: Record<string, unknown> | string): Record<string, unknown> {
  if (typeof options === 'string') {
    let parsed: unknown;
    try {
      parsed = JSON.parse(options);
    } catch (err) {
      throw new LandingAIADEError(`options is not valid JSON: ${(err as Error).message}`);
    }
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new LandingAIADEError('options JSON string must decode to an object');
    }
    return parsed as Record<string, unknown>;
  }
  if (typeof options === 'object' && options !== null && !Array.isArray(options)) {
    return { ...options };
  }
  throw new LandingAIADEError(
    `Unsupported options type: ${Array.isArray(options) ? 'array' : typeof options}`,
  );
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
  // `password` is shorthand for the contract field `options.password`, which is
  // where the spec declares the password and the only place it declares it. Fold
  // the shorthand in so the request carries the key exactly once, and never write
  // a top-level `password` field: the contract has none, so a gateway drops it and
  // the caller loses the key with nothing to show for it.
  let opts = options === undefined || options === null ? undefined : coerceOptions(options);
  // An explicit `options.password` beats the shorthand, `null` included -- the spec
  // types the field `string | null`, and null means "no password". `undefined` is
  // not a value here: it is how JS spells "absent", and `JSON.stringify` drops the
  // key, so it must fall through to the shorthand rather than suppress it and leave
  // the request carrying no password at all. Test the value, not key presence.
  // ade-python breaks the tie the same way (`_build_parse_body`) -- the two SDKs
  // used to disagree, which is what this rule exists to settle.
  // Read it as an OWN property: `opts?.['password']` walks the prototype chain, so a
  // polluted `Object.prototype.password` would suppress the shorthand on every call and
  // then serialize to nothing -- a locked PDF sent with no password at all.
  const explicit =
    opts !== undefined && Object.prototype.hasOwnProperty.call(opts, 'password') ?
      opts['password']
    : undefined;
  if (password !== undefined && password !== null && explicit === undefined) {
    opts = { ...opts, password };
  }
  if (opts !== undefined) {
    body['options'] = JSON.stringify(opts);
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
