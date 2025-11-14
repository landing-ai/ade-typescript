// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Metadata, asTextContentResult } from 'landingai-ade-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LandingAIADE from 'landingai-ade';
import { saveResultIfNeeded, createPreview } from '../handler-utils';

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
    "Get the status of an async parse job by job_id. Returns job status (pending/processing/completed/failed) and progress. If completed and ADE_OUTPUT_DIR is set, the full result will be saved to disk and you'll receive a preview.",
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

  const result = await client.parseJobs.get(job_id);

  if (result.status === 'completed' && result.data) {
    const { saved_to } = saveResultIfNeeded({
      result,
      filename: `parse_job_${job_id}`,
    });

    // If saved to disk, return a preview
    if (saved_to) {
      const preview = createPreview(result);
      return asTextContentResult({
        preview,
        message: `Full result saved to ${saved_to}. Do not ask the LLM to read this file because it will incur a lot of tokens due to it being very large.`,
      });
    }

    // If not saved, return full result
    return asTextContentResult(result);
  }

  return asTextContentResult({
    job_id: result.job_id,
    status: result.status,
    progress: result.progress,
    received_at: result.received_at,
    org_id: result.org_id,
    version: result.version,
  });
};

export default { metadata, tool, handler };
