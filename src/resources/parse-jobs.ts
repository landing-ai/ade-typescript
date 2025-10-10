// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as Shared from './shared';
import { APIPromise } from '../core/api-promise';
import { type Uploadable } from '../core/uploads';
import { RequestOptions } from '../internal/request-options';
import { multipartFormRequestOptions } from '../internal/uploads';
import { path } from '../internal/utils/path';

export class ParseJobs extends APIResource {
  /**
   * Parse documents asynchronously.
   *
   * This endpoint creates a job that handles the processing for both large documents
   * and large batches of documents.
   *
   * For EU users, use this endpoint:
   *
   *     `https://api.va.eu-west-1.landing.ai/v1/ade/parse/jobs`.
   */
  create(body: ParseJobCreateParams, options?: RequestOptions): APIPromise<ParseJobCreateResponse> {
    return this._client.post(
      '/v1/ade/parse/jobs',
      multipartFormRequestOptions({ body, ...options }, this._client),
    );
  }

  /**
   * List all async parse jobs associated with your API key. Returns the list of jobs
   * or an error response. For EU users, use this endpoint:
   *
   * `https://api.va.eu-west-1.landing.ai/v1/ade/parse/jobs`.
   */
  list(
    query: ParseJobListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ParseJobListResponse> {
    return this._client.get('/v1/ade/parse/jobs', { query, ...options });
  }

  /**
   * Get the status for an async parse job.
   *
   * Returns the job status or an error response. For EU users, use this endpoint:
   *
   * `https://api.va.eu-west-1.landing.ai/v1/ade/parse/jobs/{job_id}`.
   */
  get(jobID: string, options?: RequestOptions): APIPromise<ParseJobGetResponse> {
    return this._client.get(path`/v1/ade/parse/jobs/${jobID}`, options);
  }
}

export interface ParseJobCreateResponse {
  job_id: string;
}

/**
 * Response for listing jobs.
 */
export interface ParseJobListResponse {
  jobs: Array<ParseJobListResponse.Job>;

  has_more?: boolean;

  org_id?: string | null;
}

export namespace ParseJobListResponse {
  /**
   * Summary of a job for listing.
   */
  export interface Job {
    job_id: string;

    /**
     * Job completion progress as a decimal from 0 to 1, where 0 is not started, 1 is
     * finished, and values between 0 and 1 indicate work in progress.
     */
    progress: number;

    received_at: number;

    status: string;

    failure_reason?: string | null;
  }
}

/**
 * Unified response for job status endpoint.
 */
export interface ParseJobGetResponse {
  job_id: string;

  /**
   * Job completion progress as a decimal from 0 to 1, where 0 is not started, 1 is
   * finished, and values between 0 and 1 indicate work in progress.
   */
  progress: number;

  received_at: number;

  status: string;

  /**
   * The parsed output, if the job is complete and the `output_save_url` parameter
   * was not used.
   */
  data?: ParseJobGetResponse.Data | null;

  failure_reason?: string | null;

  metadata?: Shared.ParseMetadata | null;

  org_id?: string | null;

  /**
   * The URL to the parsed content, if the job is complete and the result is larger
   * than 1MB or the `output_save_url` parameter was used.
   */
  output_url?: string | null;

  version?: string | null;
}

export namespace ParseJobGetResponse {
  /**
   * The parsed output, if the job is complete and the `output_save_url` parameter
   * was not used.
   */
  export interface Data {
    chunks: Array<Data.Chunk>;

    markdown: string;

    metadata: Shared.ParseMetadata;

    splits: Array<Data.Split>;

    grounding?: { [key: string]: Data.Grounding };
  }

  export namespace Data {
    export interface Chunk {
      id: string;

      grounding: Chunk.Grounding;

      markdown: string;

      type: string;
    }

    export namespace Chunk {
      export interface Grounding {
        box: Shared.ParseGroundingBox;

        page: number;
      }
    }

    export interface Split {
      chunks: Array<string>;

      class: string;

      identifier: string;

      markdown: string;

      pages: Array<number>;
    }

    export interface Grounding {
      box: Shared.ParseGroundingBox;

      page: number;

      type:
        | 'chunkLogo'
        | 'chunkCard'
        | 'chunkAttestation'
        | 'chunkScanCode'
        | 'chunkForm'
        | 'chunkTable'
        | 'chunkFigure'
        | 'chunkText'
        | 'chunkMarginalia'
        | 'chunkTitle'
        | 'chunkPageHeader'
        | 'chunkPageFooter'
        | 'chunkPageNumber'
        | 'chunkKeyValue'
        | 'table'
        | 'tableCell';
    }
  }
}

export interface ParseJobCreateParams {
  /**
   * A file to be parsed. The file can be a PDF or an image. See the list of
   * supported file types here: https://docs.landing.ai/ade/ade-file-types. Either
   * this parameter or the `document_url` parameter must be provided.
   */
  document?: Uploadable | null;

  /**
   * The URL to the file to be parsed. The file can be a PDF or an image. See the
   * list of supported file types here: https://docs.landing.ai/ade/ade-file-types.
   * Either this parameter or the `document` parameter must be provided.
   */
  document_url?: string | null;

  /**
   * The version of the model to use for parsing.
   */
  model?: string | null;

  /**
   * If zero data retention (ZDR) is enabled, you must enter a URL for the parsed
   * output to be saved to. When ZDR is enabled, the parsed content will not be in
   * the API response.
   */
  output_save_url?: string | null;

  /**
   * If you want to split documents into smaller sections, include the split
   * parameter. Set the parameter to page to split documents at the page level. The
   * splits object in the API output will contain a set of data for each page.
   */
  split?: 'page' | null;
}

export interface ParseJobListParams {
  /**
   * Page number (0-indexed)
   */
  page?: number;

  /**
   * Number of items per page
   */
  pageSize?: number;

  /**
   * Filter by job status.
   */
  status?: 'cancelled' | 'completed' | 'failed' | 'pending' | 'processing' | null;
}

export declare namespace ParseJobs {
  export {
    type ParseJobCreateResponse as ParseJobCreateResponse,
    type ParseJobListResponse as ParseJobListResponse,
    type ParseJobGetResponse as ParseJobGetResponse,
    type ParseJobCreateParams as ParseJobCreateParams,
    type ParseJobListParams as ParseJobListParams,
  };
}
