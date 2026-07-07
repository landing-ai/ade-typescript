export function getWorkerPath(): string {
  return require.resolve('./code-tool-worker.mjs');
}
