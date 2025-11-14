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

export function saveResultIfNeeded(options: SaveResultOptions): any {
  const { result, filename, summary } = options;
  const outputDir = process.env['ADE_OUTPUT_DIR'];

  if (outputDir) {
    fs.mkdirSync(outputDir, { recursive: true });

    const outputFile = path.join(outputDir, `${filename}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));

    return {
      ...summary,
      saved_to: outputFile,
      message: `Full result saved to ${outputFile}`,
    };
  }

  return result;
}
