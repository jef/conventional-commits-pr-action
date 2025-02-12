/** @type {import("ts-jest").JestConfigWithTsJest} **/
module.exports = {
  collectCoverage: true,
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
  testPathIgnorePatterns: ['<rootDir>/dist/'],
};
