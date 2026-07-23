import { _getInputFilename, _saveResponse } from '../../client';
import { RequestOptions } from '../../internal/request-options';
import { multipartFormRequestOptions } from '../../internal/uploads';
import { V2Resource, throwIfSyncTimeout } from './_base';
import { BuildSchemaJobs, V2BuildSchemaParams, buildBuildSchemaBody } from './build-schema';
import { Files } from './files';
import { ExtractJobs, V2ExtractParams, buildExtractBody } from './extract';
import { GroundJobs, V2GroundParams, buildGroundBody } from './ground';
import { ParseJobs, V2ParseParams, buildParseForm } from './parse';
import { WorkflowJobs, V2WorkflowParams, prepareWorkflowRequest } from './workflow';
import {
  V2BuildSchemaResult,
  V2ExtractResult,
  V2GroundResult,
  V2ParseResponse,
  V2WorkflowResult,
} from './types';

/**
 * Container for the additive V2 (ADE gateway) surface: `client.v2.*`. All
 * requests route to the client's resolved `v2BaseURL` and share the V1
 * transport (auth, retries, fetch). Using it does not change any V1 behavior.
 */
export class V2 extends V2Resource {
  files: Files = new Files(this._client);
  parseJobs: ParseJobs = new ParseJobs(this._client);
  extractJobs: ExtractJobs = new ExtractJobs(this._client);
  buildSchemaJobs: BuildSchemaJobs = new BuildSchemaJobs(this._client);
  groundJobs: GroundJobs = new GroundJobs(this._client);
  workflowJobs: WorkflowJobs = new WorkflowJobs(this._client);

  /**
   * Parse a document synchronously (`POST /v2/parse`). Resolves with a
   * `V2ParseResponse` on both a full success (HTTP 200) and a partial success
   * (HTTP 206, where `metadata.failed_pages` lists unparsed pages). Rejects with
   * `V2SyncTimeoutError` on a 504; use `parseJobs` for long-running documents.
   *
   * Pass `saveTo` to also write the response to disk (a `.json` path writes
   * there directly; otherwise it is treated as a directory with an auto-named
   * file), mirroring the V1 `saveTo` behavior.
   */
  async parse(body: V2ParseParams & { saveTo?: string }, options?: RequestOptions): Promise<V2ParseResponse> {
    const { saveTo, ...rest } = body;
    try {
      // A 504 means the server cancelled the (long-running) work, so retrying
      // re-runs a doomed request. Cap retries at 1 (below the client default) so
      // a 504 costs at most 2 attempts, while a transient connection blip on this
      // long sync call can still recover once. Caller can override via options.
      const result = await this._client.post<V2ParseResponse>(
        this.v2Url('/v2/parse'),
        multipartFormRequestOptions({ body: buildParseForm(rest), maxRetries: 1, ...options }, this._client),
      );
      if (saveTo) {
        const filename = _getInputFilename(rest.document ?? null, rest.document_url ?? null);
        _saveResponse(saveTo, filename, 'parse', result);
      }
      return result;
    } catch (err) {
      throwIfSyncTimeout(err);
      throw err;
    }
  }

  /**
   * Extract structured data from markdown synchronously (`POST /v2/extract`,
   * JSON body). `schema` accepts a JSON-Schema object or a JSON-encoded string.
   * Provide exactly one of `markdown` or `markdown_url`. Rejects with
   * `V2SyncTimeoutError` on a 504; use `extractJobs` for long-running documents.
   */
  async extract(
    body: V2ExtractParams & { saveTo?: string },
    options?: RequestOptions,
  ): Promise<V2ExtractResult> {
    const { saveTo, ...rest } = body;
    try {
      const result = await this._client.post<V2ExtractResult>(this.v2Url('/v2/extract'), {
        body: buildExtractBody(rest),
        maxRetries: 1, // see parse(): cap sync retries so a 504 costs <= 2 attempts
        ...options,
      });
      if (saveTo) {
        const filename = _getInputFilename(null, rest.markdown_url ?? null);
        _saveResponse(saveTo, filename, 'extract', result);
      }
      return result;
    } catch (err) {
      throwIfSyncTimeout(err);
      throw err;
    }
  }

  /**
   * Generate or edit a JSON Schema for extraction synchronously
   * (`POST /v2/extract/build-schema`, JSON body). Supply any combination of
   * source `markdowns` (inline content) / `markdown_urls`, a natural-language
   * `prompt`, and/or an existing `schema` to iterate on; `extraction_schema` on
   * the result is the generated JSON Schema serialized as a string. Rejects with
   * `V2SyncTimeoutError` on a 504; use `buildSchemaJobs` for long-running inputs.
   *
   * Pass `saveTo` to also write the response to disk, mirroring the V1 `saveTo`
   * behavior.
   */
  async buildSchema(
    body: V2BuildSchemaParams & { saveTo?: string },
    options?: RequestOptions,
  ): Promise<V2BuildSchemaResult> {
    const { saveTo, ...rest } = body;
    try {
      const result = await this._client.post<V2BuildSchemaResult>(this.v2Url('/v2/extract/build-schema'), {
        body: buildBuildSchemaBody(rest),
        maxRetries: 1, // see parse(): cap sync retries so a 504 costs <= 2 attempts
        ...options,
      });
      if (saveTo) {
        _saveResponse(saveTo, _getInputFilename(null, null), 'build-schema', result);
      }
      return result;
    } catch (err) {
      throwIfSyncTimeout(err);
      throw err;
    }
  }

  /**
   * Map extracted fields back to the document blocks they were quoted from
   * synchronously (`POST /v2/ground`, JSON body). Pass the `extraction_metadata`
   * from an extract call and the `structure` tree from the parse the markdown
   * came from; resolves with a `V2GroundResult` whose `grounding` mirrors the
   * `extraction_metadata` tree. Rejects with `V2SyncTimeoutError` on a 504; use
   * `groundJobs` for long-running inputs.
   *
   * Pass `saveTo` to also write the response to disk, mirroring the V1 `saveTo`
   * behavior.
   */
  async ground(
    body: V2GroundParams & { saveTo?: string },
    options?: RequestOptions,
  ): Promise<V2GroundResult> {
    const { saveTo, ...rest } = body;
    try {
      const result = await this._client.post<V2GroundResult>(this.v2Url('/v2/ground'), {
        body: buildGroundBody(rest),
        maxRetries: 1, // see parse(): cap sync retries so a 504 costs <= 2 attempts
        ...options,
      });
      if (saveTo) {
        _saveResponse(saveTo, _getInputFilename(null, null), 'ground', result);
      }
      return result;
    } catch (err) {
      throwIfSyncTimeout(err);
      throw err;
    }
  }

  /**
   * Run a workflow synchronously (`POST /v2/workflow`). Phase 1 supports a single
   * `parse-extract` step. Reference documents by uploading via
   * `client.v2.files.upload` and passing the returned ref as
   * `inputs.<name>.document_ref`, or use `document_url`. Rejects with
   * `V2SyncTimeoutError` on a 504; use `workflowJobs` for long-running documents.
   */
  async workflow(
    body: V2WorkflowParams & { saveTo?: string },
    options?: RequestOptions,
  ): Promise<V2WorkflowResult> {
    const { saveTo, ...rest } = body;
    try {
      const { multipart, body: reqBody } = prepareWorkflowRequest(rest);
      const result = await this._client.post<V2WorkflowResult>(
        this.v2Url('/v2/workflow'),
        multipart ?
          multipartFormRequestOptions({ body: reqBody, maxRetries: 1, ...options }, this._client)
        : { body: reqBody, maxRetries: 1, ...options }, // see parse(): cap sync retries
      );
      if (saveTo) {
        _saveResponse(saveTo, _getInputFilename(null, null), 'workflow', result);
      }
      return result;
    } catch (err) {
      throwIfSyncTimeout(err);
      throw err;
    }
  }
}
