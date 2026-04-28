// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import * as Shared from './shared';
import { type Uploadable } from '../core/uploads';

/**
 * Response model for the classify endpoint.
 */
export interface ClassifyResponse {
  classification: Array<ClassifyResponse.Classification>;

  /**
   * Metadata for the classify response.
   */
  metadata: ClassifyResponse.Metadata;
}

export namespace ClassifyResponse {
  /**
   * A single page-level classification result.
   */
  export interface Classification {
    /**
     * Predicted class label or 'unknown'.
     */
    class: string;

    /**
     * Page number (0-based).
     */
    page: number;

    /**
     * Reason for the classification (for debugging).
     */
    reason?: string;

    /**
     * Proposed class when the prediction is 'unknown'.
     */
    suggested_class?: string | null;
  }

  /**
   * Metadata for the classify response.
   */
  export interface Metadata {
    credit_usage: number;

    duration_ms: number;

    filename: string;

    page_count: number;

    job_id?: string;

    org_id?: string | null;

    version?: string | null;
  }
}

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

export interface ExtractBuildSchemaResponse {
  /**
   * The generated JSON schema as a string.
   */
  extraction_schema: string;

  /**
   * The metadata for the schema generation process.
   */
  metadata: ExtractBuildSchemaResponse.Metadata;
}

export namespace ExtractBuildSchemaResponse {
  /**
   * The metadata for the schema generation process.
   */
  export interface Metadata {
    credit_usage?: number;

    duration_ms?: number;

    filename?: string | null;

    job_id?: string;

    org_id?: string | null;

    version?: string | null;

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

    confidence?: number | null;

    low_confidence_spans?: Array<ParseResponseGrounding.LowConfidenceSpan>;
  }

  export namespace ParseResponseGrounding {
    export interface LowConfidenceSpan {
      confidence: number;

      span: Array<unknown>;

      text: string;
    }
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

    confidence?: number | null;

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
 * Response model for section endpoint.
 */
export interface SectionResponse {
  /**
   * Public metadata for section response.
   */
  metadata: SectionResponse.Metadata;

  table_of_contents: Array<SectionResponse.TableOfContent>;

  table_of_contents_md: string;
}

export namespace SectionResponse {
  /**
   * Public metadata for section response.
   */
  export interface Metadata {
    credit_usage: number;

    duration_ms: number;

    filename: string;

    job_id?: string;

    org_id?: string | null;

    version?: string | null;
  }

  /**
   * A single entry in the flat table of contents.
   */
  export interface TableOfContent {
    level: number;

    section_number: string;

    start_reference: string;

    title: string;
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

export interface ClassifyParams {
  /**
   * The possible classes that can be assigned to pages in the document. Each entry
   * is an object with a `class` name and an optional `description`. Only one class
   * is assigned per page; unclassifiable pages receive 'unknown'. Can be provided as
   * a JSON string in form data.
   */
  classes: Array<ClassifyParams.Class>;

  /**
   * A file to be classified. Either this parameter or the `document_url` parameter
   * must be provided.
   */
  document?: Uploadable | null;

  /**
   * The URL of the document to be classified. Either this parameter or the
   * `document` parameter must be provided.
   */
  document_url?: string | null;

  /**
   * Classification model version. Defaults to the latest.
   */
  model?: string | null;
}

export namespace ClassifyParams {
  /**
   * A single classification option: a class name plus optional description.
   */
  export interface Class {
    /**
     * Name of the class.
     */
    class: string;

    /**
     * Detailed description of what this class represents.
     */
    description?: string | null;
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

  /**
   * If True, reject schemas with unsupported fields (HTTP 422). If False, prune
   * unsupported fields and continue. Only applies to extract versions that support
   * schema validation.
   */
  strict?: boolean;
}

export interface ExtractBuildSchemaParams {
  /**
   * URLs to Markdown files to analyze for schema generation.
   */
  markdown_urls?: Array<string> | null;

  /**
   * Markdown files or inline content strings to analyze for schema generation.
   * Multiple documents can be provided for better schema coverage.
   */
  markdowns?: Array<Uploadable | string> | null;

  /**
   * The version of the model to use for schema generation. Use `extract-latest` to
   * use the latest version.
   */
  model?: string | null;

  /**
   * Instructions for how to generate or modify the schema.
   */
  prompt?: string | null;

  /**
   * Existing JSON schema to iterate on or refine.
   */
  schema?: string | null;
}

export interface ParseParams {
  /**
   * Custom parsing prompts by chunk type. Only `figure` is supported.
   */
  custom_prompts?: ParseParams.CustomPrompts | null;

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
   * Password for encrypted document files. If the document is password-protected,
   * provide the password to decrypt and process the document. Ignored for
   * unencrypted documents.
   */
  password?: string | null;

  /**
   * If you want to split documents into smaller sections, include the split
   * parameter. Set the parameter to page to split documents at the page level. The
   * splits object in the API output will contain a set of data for each page.
   */
  split?: 'page' | null;
}

export namespace ParseParams {
  /**
   * Custom parsing prompts by chunk type. Only `figure` is supported.
   */
  export interface CustomPrompts {
    /**
     * Custom parsing prompt for figure chunks.
     */
    figure?: string;
  }
}

export interface SectionParams {
  /**
   * Natural-language instructions to control hierarchy. Examples: 'Group by topic',
   * 'Treat each numbered section as a top-level entry'.
   */
  guidelines?: string | null;

  /**
   * Parsed markdown with reference anchors (<a id='...'></a>). This is the markdown
   * field from a parse response.
   */
  markdown?: Uploadable | string | null;

  /**
   * URL to fetch the markdown from.
   */
  markdown_url?: string | null;

  /**
   * Section model version. Defaults to latest.
   */
  model?: string | null;
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
  markdown_url?: string | null;

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
    type ClassifyResponse as ClassifyResponse,
    type ExtractResponse as ExtractResponse,
    type ExtractBuildSchemaResponse as ExtractBuildSchemaResponse,
    type ParseResponse as ParseResponse,
    type SectionResponse as SectionResponse,
    type SplitResponse as SplitResponse,
    type ClassifyParams as ClassifyParams,
    type ExtractParams as ExtractParams,
    type ExtractBuildSchemaParams as ExtractBuildSchemaParams,
    type ParseParams as ParseParams,
    type SectionParams as SectionParams,
    type SplitParams as SplitParams,
  };
}
