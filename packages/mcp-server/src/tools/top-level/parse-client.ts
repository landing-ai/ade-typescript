// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { isJqError, maybeFilter } from 'landingai-ade-mcp/filtering';
import { Metadata, asErrorResult, asTextContentResult } from 'landingai-ade-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LandingAIADE from 'landingai-ade';
import * as path from 'path';
import { convertFilePathToStream, saveResultIfNeeded, createPreview } from '../handler-utils';

export const metadata: Metadata = {
  resource: '$client',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/v1/ade/parse',
  operationId: 'tool_ade_parse_v1_ade_parse_post',
};

export const tool: Tool = {
  name: 'parse_client',
  description:
    "Parse a document or spreadsheet (PDF, images, XLSX, CSV) into structured Markdown, chunks, and metadata.\n\nIMPORTANT: Always use the `jq_filter` parameter to extract only the fields you need (e.g., '.markdown' for just the markdown content).\n\nIf ADE_OUTPUT_DIR is set, the full result will be saved to disk and you'll receive a preview.",
  inputSchema: {
    type: 'object',
    properties: {
      document: {
        type: 'string',
        title: 'Document',
        description:
          'Absolute file path to the document to be parsed (e.g., "/Users/name/Desktop/file.pdf"). The file can be a PDF or an image. See the list of supported file types here: https://docs.landing.ai/ade/ade-file-types. Either this parameter or the `document_url` parameter must be provided.',
      },
      document_url: {
        type: 'string',
        title: 'Document Url',
        description:
          'The URL to the file to be parsed. The file can be a PDF or an image. See the list of supported file types here: https://docs.landing.ai/ade/ade-file-types. Either this parameter or the `document` parameter must be provided.',
      },
      model: {
        type: 'string',
        title: 'Model',
        description: 'The version of the model to use for parsing.',
      },
      split: {
        type: 'string',
        title: 'SplitType',
        description:
          'If you want to split documents into smaller sections, include the split parameter. Set the parameter to page to split documents at the page level. The splits object in the API output will contain a set of data for each page.',
        enum: ['page'],
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
  annotations: {},
};

export const handler = async (client: LandingAIADE, args: Record<string, unknown> | undefined) => {
  const { jq_filter, document, ...body } = args as any;

  const processedBody = {
    ...body,
    document: convertFilePathToStream(document),
  };

  try {
    const result = await client.parse(processedBody);
    const filename =
      typeof document === 'string' ? path.basename(document, path.extname(document)) : 'parse_result';

    // Apply jq filter to the full result first
    const filteredResult = await maybeFilter(jq_filter, result);

    // Save the full result to disk if ADE_OUTPUT_DIR is set
    const { saved_to } = saveResultIfNeeded({
      result,
      filename: `${filename}_${Date.now()}`,
    });

    // If saved to disk, return a preview of the filtered result
    if (saved_to) {
      const preview = createPreview(filteredResult);
      return asTextContentResult({
        preview,
        message: `Full result saved to ${saved_to}. Do not ask the LLM to read this file because it will incur a lot of tokens due to it being very large.`,
      });
    }

    // If not saved, return the full filtered result
    return asTextContentResult(filteredResult);
  } catch (error) {
    if (isJqError(error)) {
      return asErrorResult(error.message);
    }
    throw error;
  }
};

export default { metadata, tool, handler };
