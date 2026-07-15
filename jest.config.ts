import type { JestConfigWithTsJest } from 'ts-jest';

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
  modulePathIgnorePatterns: [
    '<rootDir>/ecosystem-tests/',
    '<rootDir>/dist/',
    '<rootDir>/deno/',
    '<rootDir>/deno_tests/',
  ],
  // tests/contract/** are LIVE (staging) tests run separately via `yarn test:contract`
  // (jest.contract.config.ts); keep them out of the default mocked/offline suite.
  testPathIgnorePatterns: ['scripts', '<rootDir>/tests/contract'],
};

export default config;
