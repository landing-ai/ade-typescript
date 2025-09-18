// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import type { Ade } from '../client';

export abstract class APIResource {
  protected _client: Ade;

  constructor(client: Ade) {
    this._client = client;
  }
}
