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
import { normalizeWorkflowJob } from './_normalize';
import { V2JobListParams } from './parse';
import { Job, JobList } from './types';

/**
 * One declared document input. Provide exactly one of `document` (a file — the
 * SDK stages it as a multipart part and references it by name), `document_ref`
 * (from `client.v2.files.upload`), or `document_url`.
 */
export interface WorkflowDocumentInput {
  document?: Uploadable | null;

  document_ref?: string | null;

  document_url?: string | null;
}

/** Parse + extract options for a `parse-extract` step. */
export interface WorkflowStepOptions {
  /** 0-indexed page indices to process (parse stage). `null` = all pages. */
  pages?: Array<number> | null;

  /** Reject unsupported schema fields with a 422 instead of skipping them (extract stage). */
  strict?: boolean;
}

/** A prebuilt pipeline step. `document` references an `inputs` entry as `"$inputs.<name>"`. */
export interface PrebuiltWorkflowStep {
  name: 'parse-extract';

  document: string;

  schema: Record<string, unknown>;

  options?: WorkflowStepOptions | null;
}

export interface V2WorkflowParams {
  /** Named document sources, referenced from steps as `"$inputs.<name>"`. */
  inputs: Record<string, WorkflowDocumentInput>;

  /** Phase 1: a single prebuilt `parse-extract` step. */
  steps: Array<PrebuiltWorkflowStep>;

  /** Optional projection map: response field name → `"$output.<step>.<field>..."`. */
  output?: Record<string, string> | null;
}

export interface V2WorkflowJobCreateParams extends V2WorkflowParams {
  /**
   * Async service tier. `priority` runs in the fast lane at the sync billing
   * rate; absent → `standard`.
   */
  service_tier?: 'standard' | 'priority' | null;
}

export interface PreparedWorkflowRequest {
  multipart: boolean;
  body: Record<string, unknown>;
}

/**
 * Build the request body for a workflow call. If any input carries a file
 * (`document`), returns a multipart form — `inputs`/`steps`/`output` as
 * JSON-encoded fields plus one binary part per file, with each file's input
 * rewritten to reference its part name. Otherwise a plain JSON body.
 */
export function prepareWorkflowRequest(params: V2WorkflowJobCreateParams): PreparedWorkflowRequest {
  const files: Array<[string, Uploadable]> = [];
  const resolvedInputs: Record<string, unknown> = {};

  for (const [key, input] of Object.entries(params.inputs)) {
    if (input.document != null) {
      // A file: stage it as a named multipart part and reference it by name.
      const partName = `document_${key}`;
      files.push([partName, input.document]);
      resolvedInputs[key] = { document: partName };
    } else {
      const resolved: Record<string, unknown> = {};
      if (input.document_ref != null) resolved['document_ref'] = input.document_ref;
      if (input.document_url != null) resolved['document_url'] = input.document_url;
      resolvedInputs[key] = resolved;
    }
  }

  if (files.length === 0) {
    const body: Record<string, unknown> = { inputs: resolvedInputs, steps: params.steps };
    if (params.output != null) body['output'] = params.output;
    if (params.service_tier != null) body['service_tier'] = params.service_tier;
    return { multipart: false, body };
  }

  // Multipart: JSON-encode the structured fields, append files as parts.
  const form: Record<string, unknown> = {
    inputs: JSON.stringify(resolvedInputs),
    steps: JSON.stringify(params.steps),
  };
  if (params.output != null) form['output'] = JSON.stringify(params.output);
  if (params.service_tier != null) form['service_tier'] = params.service_tier;
  for (const [name, file] of files) form[name] = file;
  return { multipart: true, body: form };
}

export class WorkflowJobs extends V2Resource {
  /**
   * Create an asynchronous workflow job against `/v2/workflow/jobs`. Returns a
   * normalized `Job` immediately (typically `pending`). Poll with `.get(jobID)`
   * or block until terminal with `.wait(jobID)`.
   */
  async create(body: V2WorkflowJobCreateParams, options?: RequestOptions): Promise<Job> {
    const { multipart, body: reqBody } = prepareWorkflowRequest(body);
    const raw = await this._client.post<Record<string, unknown>>(
      this.v2Url('/v2/workflow/jobs'),
      multipart ?
        multipartFormRequestOptions({ body: reqBody, ...options }, this._client)
      : { body: reqBody, ...options },
    );
    return normalizeWorkflowJob(raw);
  }

  /** Get the current status of an async workflow job by `jobID`. */
  async get(jobID: string, options?: RequestOptions): Promise<Job> {
    if (!jobID) {
      throw new LandingAIADEError(
        `Expected a non-empty value for 'jobID' but received ${JSON.stringify(jobID)}`,
      );
    }
    const raw = await this._client.get<Record<string, unknown>>(
      this.v2Url(path`/v2/workflow/jobs/${jobID}`),
      options,
    );
    return normalizeWorkflowJob(raw);
  }

  /** List async workflow jobs associated with your API key, newest first. */
  async list(query: V2JobListParams = {}, options?: RequestOptions): Promise<JobList> {
    const raw = await this._client.get<Record<string, unknown>>(this.v2Url('/v2/workflow/jobs'), {
      query: cleanQuery(query as Record<string, unknown>),
      ...options,
    });
    const jobs = jobsFromEnvelope(raw).map(normalizeWorkflowJob);
    return buildJobList(jobs, raw);
  }

  /** Block, polling `.get(jobID)` with backoff, until the job is terminal. */
  wait(jobID: string, options: WaitOptions = {}): Promise<Job> {
    return pollUntilTerminal(() => this.get(jobID), options);
  }
}
