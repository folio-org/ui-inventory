const path = require('path');
const config = require('@folio/jest-config-stripes');

module.exports = {
  ...config,
  setupFiles: [
    ...config.setupFiles,
    path.join(__dirname, './test/jest/jest.setup.js'),
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!@k-int/stripes-kint-components|@folio/.*|ky/.*|uuid/.*)',
  ],
};
