// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { IncomingMessage } from 'node:http';
import { ClientOptions } from 'landingai-ade';

export const parseAuthHeaders = (req: IncomingMessage, required?: boolean): Partial<ClientOptions> => {
  if (req.headers.authorization) {
    const scheme = req.headers.authorization.split(' ')[0]!;
    const value = req.headers.authorization.slice(scheme.length + 1);
    switch (scheme) {
      case 'Bearer':
        return { apikey: req.headers.authorization.slice('Bearer '.length) };
      default:
        throw new Error(
          'Unsupported authorization scheme. Expected the "Authorization" header to be a supported scheme (Bearer).',
        );
    }
  } else if (required) {
    throw new Error('Missing required Authorization header; see WWW-Authenticate header for details.');
  }

  const apikey =
    Array.isArray(req.headers['x-vision-agent-api-key']) ?
      req.headers['x-vision-agent-api-key'][0]
    : req.headers['x-vision-agent-api-key'];
  return { apikey };
};
