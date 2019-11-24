/* global describe it before after Nightmare */
module.exports.test = function uiTest(uiTestCtx) {
  describe('Module test: inventory:filters', function modTest() {
    const { config, helpers: { login, openApp, logout }, meta: { testVersion } } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);
    this.timeout(Number(config.test_timeout));

    const navigateTo = (segmentSelector, done) => {
      nightmare
        .wait(segmentSelector)
        .click(segmentSelector)
        .wait('#paneHeaderpane-results-subtitle')
        .wait('span[class^="noResultsMessageLabel"]')
        .then(done)
        .catch(done);
    };

    const findNoResults = (done) => {
      nightmare
        .wait('#paneHeaderpane-results-subtitle')
        .wait('span[class^="noResultsMessageLabel"]')
        .then(done)
        .catch(done);
    };

    const findMultiSelectFilteredResults = (accordionSelector, filter, done) => {
      nightmare
        .wait('#input-inventory-search')
        .type('#input-inventory-search', 0)
        .wait('#clickable-reset-all')
        .click('#clickable-reset-all')
        .wait(`section#${accordionSelector} [class^=multiSelect] [role=option]`)
        .evaluate((value, accordionId) => {
          return Array.from(document.querySelectorAll(`section#${accordionId} [class^=multiSelect] [role=option] [class^=optionSegment]`)).findIndex(e => e.textContent === value) + 1;
        }, filter, accordionSelector)
        .then((filterIndex) => {
          return nightmare
            .wait(`section#${accordionSelector} [class^=multiSelect] [role=option]:nth-of-type(${filterIndex})`)
            .click(`section#${accordionSelector} [class^=multiSelect] [role=option]:nth-of-type(${filterIndex})`)
            .wait('#list-inventory[data-total-count]')
            .click('#clickable-reset-all')
            .wait('#paneHeaderpane-results-subtitle')
            .wait('span[class^="noResultsMessageLabel"]')
            .then(done)
            .catch(done);
        })
        .catch(done);
    };

    const findCheckboxFilteredResults = (accordionSelector, filter, done) => {
      nightmare
        .wait('#input-inventory-search')
        .type('#input-inventory-search', 0)
        .wait('#clickable-reset-all')
        .click('#clickable-reset-all')
        .wait(`#${accordionSelector} #clickable-filter-${filter}`)
        .click(`#${accordionSelector} #clickable-filter-${filter}`)
        .wait('#list-inventory[data-total-count]')
        .click('#clickable-reset-all')
        .wait('#paneHeaderpane-results-subtitle')
        .wait('span[class^="noResultsMessageLabel"]')
        .then(done)
        .catch(done);
    };

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

      describe('Should test instance language filters', () => {
        const languageFilters = ['English', 'Spanish'];

        it('should navigate to inventory\'s instance segment"', (done) => {
          navigateTo('#segment-navigation-instances', done);
        });

        it('should find no results', (done) => {
          findNoResults(done);
        });

        languageFilters.forEach((language) => {
          it(`should filter results by language (${language})`, (done) => {
            findMultiSelectFilteredResults('language', language, done);
          });
        });
      });

      describe('Should test holdings permanent location filters', () => {
        const filters = ['Annex', 'Main Library'];

        it('should navigate to inventory\'s holdings segment"', (done) => {
          navigateTo('#segment-navigation-holdings', done);
        });

        it('should find no results', (done) => {
          findNoResults(done);
        });

        filters.forEach((filter) => {
          it(`should filter results by location (${filter})`, (done) => {
            findMultiSelectFilteredResults('holdingsPermanentLocationAccordion', filter, done);
          });
        });
      });

      describe('Should test items item-status filters', () => {
        const filters = ['itemStatus-available', 'itemStatus-checked-out'];

        it('should navigate to inventory\'s items segment"', (done) => {
          navigateTo('#segment-navigation-items', done);
        });

        it('should find no results', (done) => {
          findNoResults(done);
        });

        filters.forEach((filter) => {
          it(`should filter results by location (${filter})`, (done) => {
            findCheckboxFilteredResults('itemFilterAccordion', filter, done);
          });
        });
      });
    });
  });
};
