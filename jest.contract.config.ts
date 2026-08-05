import type { JestConfigWithTsJest } from 'ts-jest';

// Config for the LIVE STAGING contract tests (tests/contract/*-smoke.test.ts), kept separate from
// jest.config.ts so the default `./scripts/test` run stays fully mocked and offline. Run these with
// `yarn test:contract` (they skip themselves when the target env's API key is absent). Same source
// module mapping as the main config, scoped to tests/contract via `roots`.
//
// The production e2e file in the same directory is deliberately excluded: it spends real credits and
// belongs to `yarn test:production` (jest.production.config.ts) alone.
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
  testPathIgnorePatterns: ['<rootDir>/tests/contract/.*-production\\.test\\.ts$'],
};

export default config;
