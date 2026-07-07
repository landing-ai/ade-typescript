import type { LandingAIADE } from '../client';

export abstract class APIResource {
  protected _client: LandingAIADE;

  constructor(client: LandingAIADE) {
    this._client = client;
  }
}
