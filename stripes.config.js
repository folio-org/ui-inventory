module.exports = {
  okapi: {
    url: 'https://folio-testing-okapi.dev.folio.org',
    tenant: 'diku',
  },
  // okapi: { url: 'https://folio-testing-okapi.dev.folio.org', tenant: 'diku' },
  config: {
    languages: ['en'],
    hasAllPerms: true,
  },
  modules: { '@folio/inventory': {} },
};
