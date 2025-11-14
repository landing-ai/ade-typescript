// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Metadata, asTextContentResult } from 'landingai-ade-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LandingAIADE from 'landingai-ade';
import * as fs from 'fs';
import * as path from 'path';

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

  const result = await client.parseJobs.get(job_id);

  const outputDir = process.env['ADE_OUTPUT_DIR'];

  if (result.status === 'completed' && result.data) {
    if (outputDir) {
      fs.mkdirSync(outputDir, { recursive: true });

      const outputFile = path.join(outputDir, `parse_job_${job_id}.json`);
      fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));

      return asTextContentResult({
        job_id: result.job_id,
        status: result.status,
        progress: result.progress,
        metadata: result.metadata,
        saved_to: outputFile,
        message: `Full parse result saved to ${outputFile}`,
      });
    }

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
