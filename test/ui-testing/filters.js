/* global describe it before after Nightmare */

module.exports.test = function uiTest(uiTestCtx) {
  describe('Module test: inventory:filters', function modTest() {
    const { config, helpers: { login, openApp, logout }, meta: { testVersion } } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    this.timeout(Number(config.test_timeout));
    // Resource type filter test disabled as new resource types are being loaded.
    // const filters = ['resource-books', 'resource-serials', 'resource-ebooks', 'language-english', 'language-spanish', 'location-annex'];
    const languageFilters = ['English', 'Spanish'];
    const locationFilters = ['location-annex', 'location-main-library'];

    describe('Login > Open module "Inventory" > Get hit counts > Click filters > Logout', () => {
      before((done) => {
        login(nightmare, config, done); // logs in with the default admin credentials
      });
      after((done) => {
        logout(nightmare, config, done);
      });
      it('should open module "Inventory" and find version tag ', (done) => {
        nightmare
          .use(openApp(nightmare, config, done, 'inventory', testVersion))
          .then(result => result);
      });
      it('should find "no results" message with no filters applied', (done) => {
        nightmare
          .wait('#paneHeaderpane-results-subtitle')
          .wait('span[class^="noResultsMessageLabel"]')
          .then(done)
          .catch(done);
      });
      locationFilters.forEach((filter) => {
        it(`should click ${filter} and find hit count`, (done) => {
          nightmare
            .wait('#input-inventory-search')
            .type('#input-inventory-search', 0)
            .wait('#clickable-reset-all')
            .click('#clickable-reset-all')
            .wait(`#clickable-filter-${filter}`)
            .click(`#clickable-filter-${filter}`)
            .wait('#list-inventory[data-total-count]')
            .click('#clickable-reset-all')
            .wait('#paneHeaderpane-results-subtitle')
            .wait('span[class^="noResultsMessageLabel"]')
            .then(done)
            .catch(done);
        });
      });

      languageFilters.forEach((filter) => {
        it(`should click ${filter} and find hit count`, (done) => {
          nightmare
            .wait('#input-inventory-search')
            .type('#input-inventory-search', 0)
            .wait('#clickable-reset-all')
            .click('#clickable-reset-all')
            .wait('div[class^=multiSelect] li[role=option]')
            .evaluate((language) => {
              return Array.from(document.querySelectorAll('div[class^=multiSelect] li[role=option]')).findIndex(e => e.textContent.startsWith(language)) + 1;
            }, filter)
            .then((filterIndex) => {
              nightmare
                .wait(`div[class^=multiSelect] li[role=option]:nth-of-type(${filterIndex})`)
                .click(`div[class^=multiSelect] li[role=option]:nth-of-type(${filterIndex})`)
                .wait('#list-inventory[data-total-count]')
                .click('#clickable-reset-all')
                .wait('#paneHeaderpane-results-subtitle')
                .wait('span[class^="noResultsMessageLabel"]')
                .then(done)
                .catch(done);
            })
            .catch(done);
        });
      });
    });
  });
};
