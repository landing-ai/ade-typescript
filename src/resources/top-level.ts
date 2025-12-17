// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import * as Shared from './shared';
import { type Uploadable } from '../core/uploads';

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
  }
}

export interface ParseResponse {
  chunks: Array<ParseResponse.Chunk>;

  markdown: string;

  metadata: Shared.ParseMetadata;

  splits: Array<ParseResponse.Split>;

  grounding?: { [key: string]: ParseResponse.Grounding };
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

/**
 * Response model for split classification endpoint.
 */
export interface SplitResponse {
  /**
   * Metadata for split classification response.
   */
  metadata: SplitResponse.Metadata;

  splits: Array<SplitResponse.Split>;
}

export namespace SplitResponse {
  /**
   * Metadata for split classification response.
   */
  export interface Metadata {
    credit_usage: number;

    duration_ms: number;

    filename: string;

    page_count: number;

    /**
     * Inference history job ID
     */
    job_id?: string;

    /**
     * Organization ID
     */
    org_id?: string | null;

    /**
     * Model version used for split classification
     */
    version?: string | null;
  }

  /**
   * Split data for split classification endpoint.
   */
  export interface Split {
    classification: string;

    identifier: string | null;

    markdowns: Array<string>;

    pages: Array<number>;
  }
}

export interface ExtractParams {
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
}

export interface ParseParams {
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
   * If you want to split documents into smaller sections, include the split
   * parameter. Set the parameter to page to split documents at the page level. The
   * splits object in the API output will contain a set of data for each page.
   */
  split?: 'page' | null;
}

export interface SplitParams {
  /**
   * List of split classification options/configuration. Can be provided as JSON
   * string in form data.
   */
  split_class: Array<SplitParams.SplitClass>;

  /**
   * The Markdown file or Markdown content to split.
   */
  markdown?: Uploadable | string | null;

  /**
   * The URL to the Markdown file to split.
   */
  markdownUrl?: string | null;

  /**
   * Model version to use for split classification. Defaults to the latest version.
   */
  model?: string | null;
}

export namespace SplitParams {
  /**
   * Model for split classification option.
   */
  export interface SplitClass {
    /**
     * Name of the split classification type
     */
    name: string;

    /**
     * Detailed description of what this split type represents
     */
    description?: string | null;

    /**
     * Identifier to partition/group the splits by
     */
    identifier?: string | null;
  }
}

export declare namespace TopLevel {
  export {
    type ExtractResponse as ExtractResponse,
    type ParseResponse as ParseResponse,
    type SplitResponse as SplitResponse,
    type ExtractParams as ExtractParams,
    type ParseParams as ParseParams,
    type SplitParams as SplitParams,
  };
}
