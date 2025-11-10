// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Metadata, asTextContentResult } from 'landingai-ade-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LandingAIADE from 'landingai-ade';

export const metadata: Metadata = {
  resource: 'parse_jobs',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/v1/ade/parse/jobs/{job_id}',
  operationId: 'tool_ade_get_parse_jobs_v1_ade_parse_jobs__job_id__get',
};

export const tool: Tool = {
  name: 'get_parse_jobs',
  description:
    'Get the status for an async parse job.\n\nReturns the job status or an error\n   response. For EU users, use this endpoint:\n\n\n   `https://api.va.eu-west-1.landing.ai/v1/ade/parse/jobs/{job_id}`.',
  inputSchema: {
    type: 'object',
    properties: {
      job_id: {
        type: 'string',
        title: 'Job Id',
      },
    },
    required: ['job_id'],
  },
  annotations: {
    readOnlyHint: true,
  },
};

export const handler = async (client: LandingAIADE, args: Record<string, unknown> | undefined) => {
  const { job_id, ...body } = args as any;
  return asTextContentResult(await client.parseJobs.get(job_id));
};

export default { metadata, tool, handler };
