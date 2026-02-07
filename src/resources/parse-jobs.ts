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
   * The parsed output (ParseResponse for documents, SpreadsheetParseResponse for
   * spreadsheets), if the job is complete and the `output_save_url` parameter was
   * not used.
   */
  data?: ParseJobGetResponse.ParseResponse | ParseJobGetResponse.SpreadsheetParseResponse | null;

  failure_reason?: string | null;

  metadata?: Shared.ParseMetadata | null;

  org_id?: string | null;

  /**
   * The URL to the parsed content. This field contains a URL when the job is
   * complete and either you specified the `output_save_url` parameter or the result
   * is larger than 1MB. When the result exceeds 1MB, the URL is a presigned S3 URL
   * that expires after 1 hour. Each time you GET the job, a new presigned URL is
   * generated.
   */
  output_url?: string | null;

  version?: string | null;
}

export namespace ParseJobGetResponse {
  export interface ParseResponse {
    chunks: Array<ParseResponse.Chunk>;

    markdown: string;

    metadata: Shared.ParseMetadata;

    splits: Array<ParseResponse.Split>;

    grounding?: {
      [key: string]: ParseResponse.ParseResponseGrounding | ParseResponse.ParseResponseTableCellGrounding;
    };
  }

  export namespace ParseResponse {
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

    export interface ParseResponseGrounding {
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

    export interface ParseResponseTableCellGrounding {
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

      position?: ParseResponseTableCellGrounding.Position | null;
    }

    export namespace ParseResponseTableCellGrounding {
      export interface Position {
        chunk_id: string;

        col: number;

        colspan: number;

        row: number;

        rowspan: number;
      }
    }
  }

  /**
   * Response from /ade/parse-spreadsheet endpoint.
   *
   * Similar structure to ParseResponse but without grounding.
   */
  export interface SpreadsheetParseResponse {
    /**
     * List of table chunks (HTML)
     */
    chunks: Array<SpreadsheetParseResponse.Chunk>;

    /**
     * Full document as HTML with anchor tags and tables
     */
    markdown: string;

    /**
     * Metadata for spreadsheet parsing result.
     */
    metadata: SpreadsheetParseResponse.Metadata;

    /**
     * Sheet-based splits
     */
    splits: Array<SpreadsheetParseResponse.Split>;
  }

  export namespace SpreadsheetParseResponse {
    /**
     * Chunk from spreadsheet parsing.
     *
     * Can represent:
     *
     * - Table chunks from spreadsheet cells
     * - Parsed content chunks from embedded images (text, table, figure, etc.)
     */
    export interface Chunk {
      /**
       * Chunk ID - format: '{sheet_name}-{cell_range}' for tables,
       * '{sheet_name}-image-{index}-{anchor_cell}-chunk-{i}-{type}' for parsed image
       * chunks
       */
      id: string;

      /**
       * Chunk content as HTML table with anchor tag (for tables) or parsed markdown
       * content (for chunks from images)
       */
      markdown: string;

      /**
       * Chunk type: 'table' for spreadsheet tables, or types from /parse (text, table,
       * figure, form, etc.) for chunks derived from embedded images
       */
      type: string;

      /**
       * Visual grounding coordinates from /parse API (only for chunks derived from
       * embedded images)
       */
      grounding?: Chunk.Grounding | null;
    }

    export namespace Chunk {
      /**
       * Visual grounding coordinates from /parse API (only for chunks derived from
       * embedded images)
       */
      export interface Grounding {
        box: Shared.ParseGroundingBox;

        page: number;
      }
    }

    /**
     * Metadata for spreadsheet parsing result.
     */
    export interface Metadata {
      /**
       * Processing duration in milliseconds
       */
      duration_ms: number;

      /**
       * Original filename
       */
      filename: string;

      /**
       * Number of sheets processed
       */
      sheet_count: number;

      /**
       * Total non-empty cells across all sheets
       */
      total_cells: number;

      /**
       * Total chunks (tables + images) extracted
       */
      total_chunks: number;

      /**
       * Total rows across all sheets
       */
      total_rows: number;

      /**
       * Credits charged
       */
      credit_usage?: number;

      /**
       * Inference history job ID
       */
      job_id?: string;

      /**
       * Organization ID
       */
      org_id?: string | null;

      /**
       * Total images extracted
       */
      total_images?: number;

      /**
       * Model version for parsing images
       */
      version?: string | null;
    }

    /**
     * Sheet-based split from spreadsheet parsing.
     *
     * Similar to ParseSplit but grouped by sheet instead of page. Supports both 'page'
     * (per-sheet) and 'full' (all sheets) split types.
     */
    export interface Split {
      /**
       * Chunk IDs in this split
       */
      chunks: Array<string>;

      /**
       * Split class: 'page' for per-sheet splits, 'full' for single split with all
       * content
       */
      class: string;

      /**
       * Split identifier: sheet name for 'page' splits, 'full' for full split
       */
      identifier: string;

      /**
       * Combined markdown for this split
       */
      markdown: string;

      /**
       * Sheet indices: single element for 'page' splits, all indices for 'full' split
       */
      sheets: Array<number>;
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
  split?: 'page' | 'section' | null;
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
