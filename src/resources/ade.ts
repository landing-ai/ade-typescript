// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { type Uploadable } from '../core/uploads';
import { RequestOptions } from '../internal/request-options';
import { multipartFormRequestOptions } from '../internal/uploads';

export class Ade extends APIResource {
  /**
   * Extract structured data from Markdown using a JSON schema.
   *
   * This endpoint processes Markdown content and extracts structured data according
   * to the provided JSON schema.
   *
   * For EU users, use this endpoint:
   *
   *     `https://api.va.eu-west-1.landing.ai/v1/ade/extract`.
   */
  extract(body: AdeExtractParams, options?: RequestOptions): APIPromise<AdeExtractResponse> {
    return this._client.post(
      '/v1/ade/extract',
      multipartFormRequestOptions({ body, ...options }, this._client),
    );
  }

  /**
   * Parse a document.
   *
   * This endpoint parses documents and structured Markdown, chunks, and metadata.
   *
   * For EU users, use this endpoint:
   *
   *     `https://api.va.eu-west-1.landing.ai/v1/ade/parse`.
   */
  parse(body: AdeParseParams, options?: RequestOptions): APIPromise<AdeParseResponse> {
    return this._client.post(
      '/v1/ade/parse',
      multipartFormRequestOptions({ body, ...options }, this._client),
    );
  }
}

export interface AdeExtractResponse {
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
  metadata: AdeExtractResponse.Metadata;
}

export namespace AdeExtractResponse {
  /**
   * The metadata for the extraction process.
   */
  export interface Metadata {
    credit_usage: number;

    duration_ms: number;

    filename: string;

    org_id: string | null;

    version: string;
  }
}

export interface AdeParseResponse {
  chunks: Array<AdeParseResponse.Chunk>;

  markdown: string;

  metadata: AdeParseResponse.Metadata;

  splits: Array<AdeParseResponse.Split>;
}

export namespace AdeParseResponse {
  export interface Chunk {
    id: string;

    markdown: string;

    type: string;

    grounding?: Chunk.Grounding | null;
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

    org_id: string | null;

    page_count: number;

    version: string;
  }

  export interface Split {
    chunks: Array<string>;

    class: string;

    identifier: string;

    markdown: string;

    pages: Array<number>;
  }
}

export interface AdeExtractParams {
  /**
   * JSON schema for field extraction. This schema determines what key-values pairs
   * are extracted from the Markdown. The schema must be a valid JSON object and will
   * be validated before processing the document.
   */
  schema: string;

  /**
   * The Markdown file to extract data from.
   */
  markdown?: Uploadable | null;

  /**
   * The URL to the Markdown file to extract data from.
   */
  markdown_url?: string | null;
}

export interface AdeParseParams {
  /**
   * A file to be parsed. The file can be a PDF (50 pages max) or an image (50MB).
   * See the list of supported file types here
   * (https://docs.landing.ai/ade/ade-file-types). Either this parameter or the
   * document_url parameter must be provided.
   */
  document?: Uploadable | null;

  /**
   * The URL to the file to be parsed. The file can be a PDF (50 pages max) or an
   * image (50MB). See the list of supported file types here
   * (https://docs.landing.ai/ade/ade-file-types). Either this parameter or the
   * document parameter must be provided.
   */
  document_url?: string | null;

  /**
   * If you want to split documents into smaller sections, include the split
   * parameter. Set the parameter to page to split documents at the page level. The
   * splits object in the API output will contain a set of data for each page.
   */
  split?: 'page' | null;
}

export declare namespace Ade {
  export {
    type AdeExtractResponse as AdeExtractResponse,
    type AdeParseResponse as AdeParseResponse,
    type AdeExtractParams as AdeExtractParams,
    type AdeParseParams as AdeParseParams,
  };
}
