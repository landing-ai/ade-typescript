import { LandingAIADEError } from '../../core/error';
import { type Uploadable } from '../../core/uploads';
import { RequestOptions } from '../../internal/request-options';
import { multipartFormRequestOptions } from '../../internal/uploads';
import { V2Resource } from './_base';
import { V2FileUploadResponse } from './types';

export interface FileUploadParams {
  /** The file to stage. */
  file: Uploadable;
}

export class Files extends V2Resource {
  /**
   * Stage a file's bytes on the ADE data plane and return a `file_ref` string,
   * which can be passed as `markdown_ref` to `client.v2.extract` /
   * `client.v2.extractJobs.create`. Served on the ADE host under `/v1/files`.
   */
  async upload(body: FileUploadParams, options?: RequestOptions): Promise<string> {
    const response = await this._client.post<V2FileUploadResponse>(
      this.v2Url('/v1/files'),
      multipartFormRequestOptions({ body: { file: body.file }, ...options }, this._client),
    );
    if (!response.file_ref) {
      throw new LandingAIADEError(
        `POST /v1/files did not return a file_ref (got: ${JSON.stringify(response)}).`,
      );
    }
    return response.file_ref;
  }
}
