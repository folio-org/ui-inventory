const config = {
  externals: {
    '@folio/stripes-acq-components': {
      root: '@folio/stripes-acq-components',
      commonjs2: '@folio/stripes-acq-components',
      commonjs: '@folio/stripes-acq-components',
      amd: '@folio/stripes-acq-components',
      umd: '@folio/stripes-acq-components'
    },
    '@folio/quick-marc': {
      root: '@folio/quick-marc',
      commonjs2: '@folio/quick-marc',
      commonjs: '@folio/quick-marc',
      amd: '@folio/quick-marc',
      umd: '@folio/quick-marc'
    },
  }
};

module.exports = config;
