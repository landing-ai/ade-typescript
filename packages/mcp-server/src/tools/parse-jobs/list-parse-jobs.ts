// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { maybeFilter } from 'landingai-ade-mcp/filtering';
import { Metadata, asTextContentResult } from 'landingai-ade-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LandingAIADE from 'landingai-ade';

export const metadata: Metadata = {
  resource: 'parse_jobs',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/v1/ade/parse/jobs',
  operationId: 'tool_ade_list_parse_jobs_v1_ade_parse_jobs_get',
};

export const tool: Tool = {
  name: 'list_parse_jobs',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nList all async parse jobs associated with your API key. Returns the list of jobs\nor an error response. For EU users, use this endpoint:\n\n\n`https://api.va.eu-west-1.landing.ai/v1/ade/parse/jobs`.\n\n# Response Schema\n```json\n{\n  $ref: '#/$defs/parse_job_list_response',\n  $defs: {\n    parse_job_list_response: {\n      type: 'object',\n      title: 'JobsListResponse',\n      description: 'Response for listing jobs.',\n      properties: {\n        jobs: {\n          type: 'array',\n          title: 'Jobs',\n          items: {\n            type: 'object',\n            title: 'JobSummary',\n            description: 'Summary of a job for listing.',\n            properties: {\n              job_id: {\n                type: 'string',\n                title: 'Job Id'\n              },\n              progress: {\n                type: 'number',\n                title: 'Progress',\n                description: 'Job completion progress as a decimal from 0 to 1, where 0 is not started, 1 is finished, and values between 0 and 1 indicate work in progress.'\n              },\n              received_at: {\n                type: 'integer',\n                title: 'Received At'\n              },\n              status: {\n                type: 'string',\n                title: 'Status'\n              },\n              failure_reason: {\n                type: 'string',\n                title: 'Failure Reason'\n              }\n            },\n            required: [              'job_id',\n              'progress',\n              'received_at',\n              'status'\n            ]\n          }\n        },\n        has_more: {\n          type: 'boolean',\n          title: 'Has More'\n        },\n        org_id: {\n          type: 'string',\n          title: 'Org Id'\n        }\n      },\n      required: [        'jobs'\n      ]\n    }\n  }\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      page: {
        type: 'integer',
        title: 'Page',
        description: 'Page number (0-indexed)',
      },
      pageSize: {
        type: 'integer',
        title: 'Pagesize',
        description: 'Number of items per page',
      },
      status: {
        type: 'string',
        title: 'Status',
        description: 'Filter by job status.',
        enum: ['cancelled', 'completed', 'failed', 'pending', 'processing'],
      },
      jq_filter: {
        type: 'string',
        title: 'jq Filter',
        description:
          'A jq filter to apply to the response to include certain fields. Consult the output schema in the tool description to see the fields that are available.\n\nFor example: to include only the `name` field in every object of a results array, you can provide ".results[].name".\n\nFor more information, see the [jq documentation](https://jqlang.org/manual/).',
      },
    },
    required: [],
  },
  annotations: {
    readOnlyHint: true,
  },
};

export const handler = async (client: LandingAIADE, args: Record<string, unknown> | undefined) => {
  const { jq_filter, ...body } = args as any;
  return asTextContentResult(await maybeFilter(jq_filter, await client.parseJobs.list(body)));
};

export default { metadata, tool, handler };
