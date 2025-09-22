// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import type { Landingai } from '../client';

export abstract class APIResource {
  protected _client: Landingai;

  constructor(client: Landingai) {
    this._client = client;
  }
}
