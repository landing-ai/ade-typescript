// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

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
  }
}

export interface ParseResponse {
  chunks: Array<ParseResponse.Chunk>;

  markdown: string;

  metadata: ParseResponse.Metadata;

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
      box: Grounding.Box;

      page: number;
    }

    export namespace Grounding {
      export interface Box {
        bottom: number;

        left: number;

        right: number;

        top: number;
      }
    }
  }

  export interface Metadata {
    credit_usage: number;

    duration_ms: number;

    filename: string;

    job_id: string;

    org_id: string | null;

    page_count: number;

    version: string | null;
  }

  export interface Split {
    chunks: Array<string>;

    class: string;

    identifier: string;

    markdown: string;

    pages: Array<number>;
  }

  export interface Grounding {
    box: Grounding.Box;

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

  export namespace Grounding {
    export interface Box {
      bottom: number;

      left: number;

      right: number;

      top: number;
    }
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
  markdown?: Uploadable | null;

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

export declare namespace TopLevel {
  export {
    type ExtractResponse as ExtractResponse,
    type ParseResponse as ParseResponse,
    type ExtractParams as ExtractParams,
    type ParseParams as ParseParams,
  };
}
