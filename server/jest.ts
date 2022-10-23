import type {Config} from '@jest/types';
const config: Config.InitialOptions = {
  verbose: true,
  roots: ['<rootDir>'],
  coverageThreshold: {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  },
  modulePaths: ['<rootDir>/src'],
  collectCoverage: false,
  coverageDirectory: './tests/coverage_reports',
  collectCoverageFrom: [
    "<rootDir>/src/controllers/**/*.{js,ts}"
  ],
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-node',
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|tests).[tj]s?(x)'],
};

export default config;
