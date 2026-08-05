import type { JestConfigWithTsJest } from 'ts-jest';

// Config for the LIVE PRODUCTION e2e tests (tests/contract/v1-production.test.ts), kept separate
// from jest.contract.config.ts so that `yarn test:contract` (staging, run on spec-sync PRs) can
// never spend production credits by accident. Run these with `yarn test:production` — CI does so
// only from .github/workflows/e2e-production.yml (manual dispatch, plus the release.yml pre-tag
// gate). Same source module mapping as the other configs.
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
  // Opt IN to the production file only; the staging smoke tests live in the same directory.
  testMatch: ['<rootDir>/tests/contract/*-production.test.ts'],
  // These hit the live API serially by design: parse once, then reuse the markdown. Parallel
  // workers would re-parse per file and invite rate-limits.
  maxWorkers: 1,
};

export default config;
