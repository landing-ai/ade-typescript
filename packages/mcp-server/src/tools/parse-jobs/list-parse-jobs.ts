// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { isJqError, maybeFilter } from 'landingai-ade-mcp/filtering';
import { Metadata, asErrorResult, asTextContentResult } from 'landingai-ade-mcp/tools/types';

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
    'List all async parse jobs associated with your API key. Returns job summaries with status, progress, and job_id. Use optional filters to paginate or filter by status (pending/processing/completed/failed/cancelled).\n\nIMPORTANT: Always use the `jq_filter` parameter to extract only the fields you need.',
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
  try {
    return asTextContentResult(await maybeFilter(jq_filter, await client.parseJobs.list(body)));
  } catch (error) {
    if (isJqError(error)) {
      return asErrorResult(error.message);
    }
    throw error;
  }
};

export default { metadata, tool, handler };
