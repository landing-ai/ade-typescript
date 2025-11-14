import * as fs from 'fs';
import * as path from 'path';

/**
 * Converts a file path string to a ReadStream, or returns the original value if not a string path.
 * @param filePath - The file path string or existing stream/buffer
 * @returns ReadStream if input is a string path, otherwise returns the original input
 */
export function convertFilePathToStream(filePath: string | any): any {
  return typeof filePath === 'string' ? fs.createReadStream(filePath) : filePath;
}

/**
 * Options for saving results to the output directory
 */
interface SaveResultOptions {
  /** The result data to save */
  result: any;
  /** Filename for the output file (without extension) */
  filename: string;
  /** Summary data to return instead of full result */
  summary?: any;
}

/**
 * Saves result to output directory if ADE_OUTPUT_DIR is set, and returns appropriate content.
 * If ADE_OUTPUT_DIR is set, saves the full result to a JSON file and returns a summary.
 * Otherwise, returns the full result.
 *
 * @param options - Configuration options for saving the result
 * @returns Object with saved_to path and summary data if saved, otherwise the full result
 */
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
