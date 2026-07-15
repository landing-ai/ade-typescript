import type { JestConfigWithTsJest } from 'ts-jest';

// Config for the LIVE contract tests (tests/contract/**), kept separate from jest.config.ts so the
// default `./scripts/test` run stays fully mocked and offline. Run these with `yarn test:contract`
// (they skip themselves when the target env's API key is absent). Same source module mapping as the
// main config, scoped to tests/contract via `roots`.
const config: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', { sourceMaps: 'inline' }],
  },
  moduleNameMapper: {
    '^landingai-ade$': '<rootDir>/src/index.ts',
    '^landingai-ade/(.*)$': '<rootDir>/src/$1',
  },
  roots: ['<rootDir>/tests/contract'],
};

export default config;
