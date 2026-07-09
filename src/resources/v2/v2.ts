import { _getInputFilename, _saveResponse } from '../../client';
import { RequestOptions } from '../../internal/request-options';
import { multipartFormRequestOptions } from '../../internal/uploads';
import { V2Resource, throwIfSyncTimeout } from './_base';
import { Files } from './files';
import { ExtractJobs, V2ExtractParams, buildExtractBody } from './extract';
import { ParseJobs, V2ParseParams, buildParseForm } from './parse';
import { V2ExtractResult, V2ParseResponse } from './types';

/**
 * Container for the additive V2 (ADE gateway) surface: `client.v2.*`. All
 * requests route to the client's resolved `v2BaseURL` and share the V1
 * transport (auth, retries, fetch). Using it does not change any V1 behavior.
 */
export class V2 extends V2Resource {
  files: Files = new Files(this._client);
  parseJobs: ParseJobs = new ParseJobs(this._client);
  extractJobs: ExtractJobs = new ExtractJobs(this._client);

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
      const result = await this._client.post<V2ParseResponse>(
        this.v2Url('/v2/parse'),
        multipartFormRequestOptions({ body: buildParseForm(rest), ...options }, this._client),
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
   * Provide exactly one of `markdown`, `markdown_ref`, or `markdown_url`.
   * Rejects with `V2SyncTimeoutError` on a 504; use `extractJobs` for
   * long-running documents.
   */
  async extract(
    body: V2ExtractParams & { saveTo?: string },
    options?: RequestOptions,
  ): Promise<V2ExtractResult> {
    const { saveTo, ...rest } = body;
    try {
      const result = await this._client.post<V2ExtractResult>(this.v2Url('/v2/extract'), {
        body: buildExtractBody(rest),
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
}
