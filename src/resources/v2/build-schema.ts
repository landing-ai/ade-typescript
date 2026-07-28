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
import { normalizeBuildSchemaJob } from './_normalize';
import { V2JobListParams } from './parse';
import { Job, JobList } from './types';

export interface V2BuildSchemaParams {
  /**
   * Markdown files as inline content strings to analyze for schema generation.
   * Multiple documents can be provided for better schema coverage.
   */
  markdowns?: Array<string> | null;

  /** URLs to Markdown files to analyze for schema generation. */
  markdown_urls?: Array<string> | null;

  /** Instructions for how to generate or modify the schema. */
  prompt?: string | null;

  /**
   * Existing JSON Schema to iterate on or refine. Accepts a JSON-Schema object
   * or a JSON-encoded string; it is coerced and sent as a JSON string, matching
   * the wire contract (the endpoint takes `schema` as a serialized string).
   */
  schema?: ExtractSchema | null;
}

export interface V2BuildSchemaJobCreateParams extends V2BuildSchemaParams {
  /**
   * Async service tier. `priority` runs in the fast lane at the sync billing
   * rate; absent → `standard`.
   */
  service_tier?: 'standard' | 'priority' | null;
}

/**
 * Build the JSON body for build-schema. Unset (`undefined`/`null`) fields are
 * dropped. `schema` is coerced to a JSON object (accepting an object or a
 * JSON-encoded string) and then serialized, since the wire field is a string.
 */
export function buildBuildSchemaBody(params: V2BuildSchemaJobCreateParams): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  const entries: Array<[string, unknown]> = [
    ['markdowns', params.markdowns],
    ['markdown_urls', params.markdown_urls],
    ['prompt', params.prompt],
    ['service_tier', params.service_tier],
  ];
  for (const [key, value] of entries) {
    if (value !== undefined && value !== null) {
      body[key] = value;
    }
  }
  if (params.schema !== undefined && params.schema !== null) {
    body['schema'] = JSON.stringify(coerceSchema(params.schema));
  }
  return body;
}

export class BuildSchemaJobs extends V2Resource {
  /**
   * Create an asynchronous build-schema job against `/v2/extract/build-schema/jobs`.
   * Returns a normalized `Job` immediately (typically `pending`). Poll with
   * `.get(jobID)` or block until terminal with `.wait(jobID)`.
   */
  async create(body: V2BuildSchemaJobCreateParams, options?: RequestOptions): Promise<Job> {
    const raw = await this._client.post<Record<string, unknown>>(
      this.v2Url('/v2/extract/build-schema/jobs'),
      { body: buildBuildSchemaBody(body), ...options },
    );
    return normalizeBuildSchemaJob(raw);
  }

  /** Get the current status of an async build-schema job by `jobID`. */
  async get(jobID: string, options?: RequestOptions): Promise<Job> {
    if (!jobID) {
      throw new LandingAIADEError(
        `Expected a non-empty value for 'jobID' but received ${JSON.stringify(jobID)}`,
      );
    }
    const raw = await this._client.get<Record<string, unknown>>(
      this.v2Url(path`/v2/extract/build-schema/jobs/${jobID}`),
      options,
    );
    return normalizeBuildSchemaJob(raw);
  }

  /** List async build-schema jobs associated with your API key, newest first. */
  async list(query: V2JobListParams = {}, options?: RequestOptions): Promise<JobList> {
    const raw = await this._client.get<Record<string, unknown>>(this.v2Url('/v2/extract/build-schema/jobs'), {
      query: cleanQuery(query as Record<string, unknown>),
      ...options,
    });
    const jobs = jobsFromEnvelope(raw).map(normalizeBuildSchemaJob);
    return buildJobList(jobs, raw);
  }

  /** Block, polling `.get(jobID)` with backoff, until the job is terminal. */
  wait(jobID: string, options: WaitOptions = {}): Promise<Job> {
    return pollUntilTerminal(() => this.get(jobID), options);
  }
}
