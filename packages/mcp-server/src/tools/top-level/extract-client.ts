// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { isJqError, maybeFilter } from 'landingai-ade-mcp/filtering';
import { Metadata, asErrorResult, asTextContentResult } from 'landingai-ade-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import LandingAIADE from 'landingai-ade';
import * as fs from 'fs';
import * as path from 'path';
import { saveResultIfNeeded, createPreview } from '../handler-utils';

export const metadata: Metadata = {
  resource: '$client',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/v1/ade/extract',
  operationId: 'tool_ade_extract_v1_ade_extract_post',
};

export const tool: Tool = {
  name: 'extract_client',
  description:
    "Extract structured data from Markdown using a JSON schema. Provide a schema that defines what fields to extract.\n\nIMPORTANT: Always use the `jq_filter` parameter to extract only the fields you need (e.g., '.extraction' for just the extracted data).\n\nIf ADE_OUTPUT_DIR is set, the full result will be saved to disk and you'll receive a preview.",
  inputSchema: {
    type: 'object',
    properties: {
      schema: {
        type: 'string',
        title: 'Schema',
        description:
          'JSON schema for field extraction. This schema determines what key-values pairs are extracted from the Markdown. The schema must be a valid JSON object and will be validated before processing the document.',
      },
      markdown: {
        type: 'string',
        title: 'Markdown',
        description:
          'Can be: (1) raw Markdown content as a string, (2) an absolute file path to a Markdown file (e.g., "/Users/name/Desktop/file.md"), or (3) an absolute file path to a JSON file with a "markdown" field or "data.markdown" field (like output from parse_client or get_parse_jobs). The handler will automatically detect the type and read the file accordingly.',
      },
      markdown_url: {
        type: 'string',
        title: 'Markdown Url',
        description: 'The URL to the Markdown file to extract data from.',
      },
      model: {
        type: 'string',
        title: 'Model',
        description:
          'The version of the model to use for extraction. Use `extract-latest` to use the latest version.',
      },
      jq_filter: {
        type: 'string',
        title: 'jq Filter',
        description:
          'A jq filter to apply to the response to include certain fields. Consult the output schema in the tool description to see the fields that are available.\n\nFor example: to include only the `name` field in every object of a results array, you can provide ".results[].name".\n\nFor more information, see the [jq documentation](https://jqlang.org/manual/).',
      },
    },
    required: ['schema'],
  },
  annotations: {},
};

export const handler = async (client: LandingAIADE, args: Record<string, unknown> | undefined) => {
  const { jq_filter, markdown, schema, ...body } = args as any;

  let markdownContent = markdown;
  let isFilePath = false;

  // Check if markdown is a file path
  if (markdown && fs.existsSync(markdown)) {
    isFilePath = true;
    const ext = path.extname(markdown).toLowerCase();

    if (ext === '.json') {
      // JSON file - try to parse and look for markdown field
      try {
        const fileContent = fs.readFileSync(markdown, 'utf-8');
        const jsonData = JSON.parse(fileContent);

        // Check for top-level markdown field
        if ('markdown' in jsonData && typeof jsonData.markdown === 'string') {
          markdownContent = jsonData.markdown;
        }
        // Check for data.markdown field (like parse job output)
        else if (jsonData.data?.markdown && typeof jsonData.data.markdown === 'string') {
          markdownContent = jsonData.data.markdown;
        } else {
          return asErrorResult('The JSON does not have a "markdown" field or "data.markdown" field');
        }
      } catch (error) {
        return asErrorResult('The file is not a valid JSON object');
      }
    } else if (ext === '.md' || ext === '.markdown') {
      // Markdown file - use createReadStream
      markdownContent = fs.createReadStream(markdown);
    } else {
      // Assume it's markdown content
      markdownContent = fs.createReadStream(markdown);
    }
  }

  const processedBody = {
    ...body,
    markdown: markdownContent,
    schema: typeof schema === 'object' ? JSON.stringify(schema) : schema,
  };

  try {
    const result = await client.extract(processedBody);
    const filename = isFilePath ? path.basename(markdown, path.extname(markdown)) : 'extract_result';

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
