import { LandingAIADEError } from '../../core/error';
import { RequestOptions } from '../../internal/request-options';
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
 * One declared document input. Provide exactly one of `document` (a multipart
 * form-part name — advanced), `document_ref` (from `client.v2.files.upload`),
 * or `document_url`.
 */
export interface WorkflowDocumentInput {
  document?: string | null;

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

  idempotency_key?: string | null;
}

export interface V2WorkflowJobCreateParams extends V2WorkflowParams {
  /**
   * Async service tier. `priority` runs in the fast lane at the sync billing
   * rate; absent → `standard`.
   */
  service_tier?: 'standard' | 'priority' | null;
}

export function buildWorkflowBody(params: V2WorkflowJobCreateParams): Record<string, unknown> {
  const body: Record<string, unknown> = { inputs: params.inputs, steps: params.steps };
  if (params.output !== undefined && params.output !== null) {
    body['output'] = params.output;
  }
  if (params.idempotency_key !== undefined && params.idempotency_key !== null) {
    body['idempotency_key'] = params.idempotency_key;
  }
  if (params.service_tier !== undefined && params.service_tier !== null) {
    body['service_tier'] = params.service_tier;
  }
  return body;
}

export class WorkflowJobs extends V2Resource {
  /**
   * Create an asynchronous workflow job against `/v2/workflow/jobs`. Returns a
   * normalized `Job` immediately (typically `pending`). Poll with `.get(jobID)`
   * or block until terminal with `.wait(jobID)`.
   */
  async create(body: V2WorkflowJobCreateParams, options?: RequestOptions): Promise<Job> {
    const raw = await this._client.post<Record<string, unknown>>(this.v2Url('/v2/workflow/jobs'), {
      body: buildWorkflowBody(body),
      ...options,
    });
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
