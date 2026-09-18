const path = require('path');
const stripesJestConfig = require('@folio/jest-config-stripes');
const config = stripesJestConfig.config || stripesJestConfig;

const additionalModules = [
  '@k-int/stripes-kint-components',
  'keyboardjs',
].join('|');
const combinedModules = config.transformIgnorePatterns[0].replace(')', `|${additionalModules})`);

module.exports = {
  ...config,
  setupFiles: [
    ...config.setupFiles,
    path.join(__dirname, './test/jest/jest.setup.js'),
  ],
  transformIgnorePatterns: [combinedModules],
};
