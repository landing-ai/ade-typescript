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
import { normalizeGroundJob } from './_normalize';
import { V2JobListParams } from './parse';
import { Job, JobList } from './types';

export interface V2GroundParams {
  /**
   * The `extraction_metadata` object returned by `POST /v2/extract` (or the
   * pipeline's extract step): a tree mirroring your extraction schema whose
   * leaves are `{value, ranges}` objects, where `ranges` are `{start, end}`
   * Unicode code point offsets into the parse markdown.
   */
  extraction_metadata: Record<string, unknown>;

  /**
   * The `structure` tree from the parse response the extraction was produced
   * from. Every block in the tree carries its `grounding` (`{page, range, box}`)
   * inline; block ids in the response resolve against this exact tree.
   */
  structure: Record<string, unknown>;
}

/**
 * Ground is a pure, stateless join, so the async create-job request carries the
 * same body as the sync call — there are no extra async-only fields.
 */
export type V2GroundJobCreateParams = V2GroundParams;

/** Build the JSON body for ground: the two required objects, passed through verbatim. */
export function buildGroundBody(params: V2GroundParams): Record<string, unknown> {
  return {
    extraction_metadata: params.extraction_metadata,
    structure: params.structure,
  };
}

export class GroundJobs extends V2Resource {
  /**
   * Create an asynchronous ground job against `/v2/ground/jobs`. Returns a
   * normalized `Job` immediately (typically `pending`). Poll with `.get(jobID)`
   * or block until terminal with `.wait(jobID)`.
   */
  async create(body: V2GroundJobCreateParams, options?: RequestOptions): Promise<Job> {
    const raw = await this._client.post<Record<string, unknown>>(this.v2Url('/v2/ground/jobs'), {
      body: buildGroundBody(body),
      ...options,
    });
    return normalizeGroundJob(raw);
  }

  /** Get the current status of an async ground job by `jobID`. */
  async get(jobID: string, options?: RequestOptions): Promise<Job> {
    if (!jobID) {
      throw new LandingAIADEError(
        `Expected a non-empty value for 'jobID' but received ${JSON.stringify(jobID)}`,
      );
    }
    const raw = await this._client.get<Record<string, unknown>>(
      this.v2Url(path`/v2/ground/jobs/${jobID}`),
      options,
    );
    return normalizeGroundJob(raw);
  }

  /** List async ground jobs associated with your API key, newest first. */
  async list(query: V2JobListParams = {}, options?: RequestOptions): Promise<JobList> {
    const raw = await this._client.get<Record<string, unknown>>(this.v2Url('/v2/ground/jobs'), {
      query: cleanQuery(query as Record<string, unknown>),
      ...options,
    });
    const jobs = jobsFromEnvelope(raw).map(normalizeGroundJob);
    return buildJobList(jobs, raw);
  }

  /** Block, polling `.get(jobID)` with backoff, until the job is terminal. */
  wait(jobID: string, options: WaitOptions = {}): Promise<Job> {
    return pollUntilTerminal(() => this.get(jobID), options);
  }
}
