import * as fs from 'fs';
import * as path from 'path';

export function convertFilePathToStream(filePath: string | any): any {
  return typeof filePath === 'string' ? fs.createReadStream(filePath) : filePath;
}

interface SaveResultOptions {
  result: any;
  filename: string;
  summary?: any;
}

interface SaveResult {
  data: any;
  saved_to?: string;
  message?: string;
}

export function saveResultIfNeeded(options: SaveResultOptions): SaveResult {
  const { result, filename, summary } = options;
  const outputDir = process.env['ADE_OUTPUT_DIR'];

  if (outputDir) {
    fs.mkdirSync(outputDir, { recursive: true });

    const outputFile = path.join(outputDir, `${filename}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));

    return {
      data: summary || result,
      saved_to: outputFile,
    };
  }

  return { data: summary || result };
}

export function createPreview(data: any, maxLength: number = 200): string {
  const jsonString = JSON.stringify(data, null, 2);
  if (jsonString.length <= maxLength) {
    return jsonString;
  }
  return jsonString.substring(0, maxLength) + '\n... (truncated)';
}
