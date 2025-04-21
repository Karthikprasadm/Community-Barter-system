/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
      isolatedModules: true,
      useESM: false,
    },
  },
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js'
  ],
  testMatch: [
    '<rootDir>/src/**/*.test.[jt]s?(x)',
    '<rootDir>/src/**/*.spec.[jt]s?(x)',
    '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)'
  ],
};
