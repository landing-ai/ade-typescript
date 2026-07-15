import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { type Uploadable } from '../core/uploads';
import { RequestOptions } from '../internal/request-options';
import { multipartFormRequestOptions } from '../internal/uploads';
import { path } from '../internal/utils/path';

export class ExtractJobs extends APIResource {
  /**
   * Extract structured data asynchronously.
   *
   * This endpoint creates a job that handles the processing for large markdown
   * documents.
   *
   * For EU users, use this endpoint:
   *
   *     `https://api.va.eu-west-1.landing.ai/v1/ade/extract/jobs`.
   */
  create(body: ExtractJobCreateParams, options?: RequestOptions): APIPromise<ExtractJobCreateResponse> {
    return this._client.post(
      '/v1/ade/extract/jobs',
      multipartFormRequestOptions({ body, ...options }, this._client),
    );
  }

  /**
   * List all async extract jobs associated with your API key. Returns the list of
   * jobs or an error response. For EU users, use this endpoint:
   *
   * `https://api.va.eu-west-1.landing.ai/v1/ade/extract/jobs`.
   */
  list(
    query: ExtractJobListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ExtractJobListResponse> {
    return this._client.get('/v1/ade/extract/jobs', { query, ...options });
  }

  /**
   * Get the status for an async extract job.
   *
   * Returns the job status or an error response. For EU users, use this endpoint:
   *
   * `https://api.va.eu-west-1.landing.ai/v1/ade/extract/jobs/{job_id}`.
   */
  get(jobID: string, options?: RequestOptions): APIPromise<ExtractJobGetResponse> {
    return this._client.get(path`/v1/ade/extract/jobs/${jobID}`, options);
  }
}

export interface ExtractJobCreateResponse {
  job_id: string;
}

/**
 * Response for listing jobs.
 */
export interface ExtractJobListResponse {
  jobs: Array<ExtractJobListResponse.Job>;

  has_more?: boolean;

  org_id?: string | null;
}

export namespace ExtractJobListResponse {
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

export interface ExtractJobGetResponse {
  /**
   * A unique identifier for this extract job.
   */
  job_id: string;

  /**
   * Job completion. Either 0.0 (not yet complete) or 1.0 (complete).
   */
  progress: number;

  /**
   * Unix timestamp (in seconds) for when the job was received.
   */
  received_at: number;

  /**
   * The current state of the job: `pending`, `processing`, `completed`, `failed`, or
   * `cancelled`.
   */
  status: string;

  /**
   * The extraction results, returned here when the job is complete and you did not
   * set an `output_save_url`. Large results are returned through `output_url`
   * instead.
   */
  data?: ExtractJobGetResponse.ExtractResponse | null;

  /**
   * If the job failed, a message describing what went wrong.
   */
  failure_reason?: string | null;

  /**
   * Information about the extraction, such as the model version, duration, credit
   * usage, and any schema warnings.
   */
  metadata?: ExtractJobGetResponse.Metadata | null;

  /**
   * Organization ID.
   */
  org_id?: string | null;

  /**
   * A URL to download the extraction results. Provided when the job is complete and
   * either you set an `output_save_url` or the result is larger than 1 MB. URLs for
   * large results are temporary and expire one hour after you request the job.
   */
  output_url?: string | null;

  /**
   * The exact model snapshot used for the extraction.
   */
  version?: string | null;
}

export namespace ExtractJobGetResponse {
  /**
   * The extraction results, returned here when the job is complete and you did not
   * set an `output_save_url`. Large results are returned through `output_url`
   * instead.
   */
  export interface ExtractResponse {
    /**
     * The extracted key-value pairs.
     */
    extraction: unknown;

    /**
     * The extracted key-value pairs and the chunk_reference for each one.
     */
    extraction_metadata: unknown;

    /**
     * The metadata for the extraction process.
     */
    metadata: ExtractResponse.Metadata;
  }

  export namespace ExtractResponse {
    /**
     * The metadata for the extraction process.
     */
    export interface Metadata {
      credit_usage: number;

      duration_ms: number;

      filename: string;

      job_id: string;

      org_id: string | null;

      version: string | null;

      /**
       * The extract model that was actually used to extract the data when the initial
       * extraction attempt failed with the requested version.
       */
      fallback_model_version?: string | null;

      /**
       * A detailed error message shows why the extracted data does not fully conform to
       * the input schema. Null means the extraction result is consistent with the input
       * schema.
       */
      schema_violation_error?: string | null;

      /**
       * Structured warnings from the extraction process. Each warning is an instance of
       * ExtractWarning with 'code' (e.g. 'nonconformant_schema') and 'msg'
       * (human-readable description). Present only for extract versions from
       * extract-20260314 and above that support structured warnings.
       */
      warnings?: Array<Metadata.Warning>;
    }

    export namespace Metadata {
      export interface Warning {
        /**
         * The type of warning, used to translate to a status code downstream
         */
        code: 'nonconformant_schema' | 'nonconformant_output';

        /**
         * Human-readable description of the warning with more details
         */
        msg: string;
      }
    }
  }

  /**
   * Information about the extraction, such as the model version, duration, credit
   * usage, and any schema warnings.
   */
  export interface Metadata {
    credit_usage: number;

    duration_ms: number;

    filename: string;

    job_id: string;

    org_id: string | null;

    version: string | null;

    /**
     * The extract model that was actually used to extract the data when the initial
     * extraction attempt failed with the requested version.
     */
    fallback_model_version?: string | null;

    /**
     * A detailed error message shows why the extracted data does not fully conform to
     * the input schema. Null means the extraction result is consistent with the input
     * schema.
     */
    schema_violation_error?: string | null;

    /**
     * Structured warnings from the extraction process. Each warning is an instance of
     * ExtractWarning with 'code' (e.g. 'nonconformant_schema') and 'msg'
     * (human-readable description). Present only for extract versions from
     * extract-20260314 and above that support structured warnings.
     */
    warnings?: Array<Metadata.Warning>;
  }

  export namespace Metadata {
    export interface Warning {
      /**
       * The type of warning, used to translate to a status code downstream
       */
      code: 'nonconformant_schema' | 'nonconformant_output';

      /**
       * Human-readable description of the warning with more details
       */
      msg: string;
    }
  }
}

export interface ExtractJobCreateParams {
  /**
   * JSON schema for field extraction. This schema determines what key-values pairs
   * are extracted from the Markdown. The schema must be a valid JSON object and will
   * be validated before processing the document.
   */
  schema: string;

  /**
   * The Markdown file or Markdown content to extract data from.
   */
  markdown?: Uploadable | string | null;

  /**
   * The URL to the Markdown file to extract data from.
   */
  markdown_url?: string | null;

  /**
   * The version of the model to use for extraction. Use `extract-latest` to use the
   * latest version.
   */
  model?: string | null;

  /**
   * If zero data retention (ZDR) is enabled, you must enter a URL for the extracted
   * output to be saved to. When ZDR is enabled, the extracted content will not be in
   * the API response.
   */
  output_save_url?: string | null;

  /**
   * If True, reject schemas with unsupported fields (HTTP 422). If False, prune
   * unsupported fields and continue. Only applies to extract versions that support
   * schema validation.
   */
  strict?: boolean;
}

export interface ExtractJobListParams {
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

export declare namespace ExtractJobs {
  export {
    type ExtractJobCreateResponse as ExtractJobCreateResponse,
    type ExtractJobListResponse as ExtractJobListResponse,
    type ExtractJobGetResponse as ExtractJobGetResponse,
    type ExtractJobCreateParams as ExtractJobCreateParams,
    type ExtractJobListParams as ExtractJobListParams,
  };
}
