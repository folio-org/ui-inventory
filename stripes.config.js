module.exports = {
  okapi: {
    url: 'https://okapi-bugfest-orchid.int.aws.folio.org', tenant: 'fs09000000'
  },
  config: {
    logCategories: 'core,path,action,xhr',
    logPrefix: '--',
    showPerms: false,
    hasAllPerms: false,
    languages: ['en'],
    suppressIntlErrors: true,
  },
  modules: {
    '@folio/inventory': {},
  }
};
