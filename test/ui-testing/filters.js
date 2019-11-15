/* global describe it before after Nightmare */

module.exports.test = function uiTest(uiTestCtx) {
  describe('Module test: inventory:filters', function modTest() {
    const { config, helpers: { login, openApp, logout }, meta: { testVersion } } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    this.timeout(Number(config.test_timeout));
    // Resource type filter test disabled as new resource types are being loaded.
    // const filters = ['resource-books', 'resource-serials', 'resource-ebooks', 'language-english', 'language-spanish', 'location-annex'];
    const languageFilters = ['English', 'Spanish'];
    const locationFilters = ['Annex', 'Main Library'];
    const itemStatusFilters = ['itemStatus-available', 'itemStatus-checked-out'];

    /**
     * Navigate to the given segment, then choose each of the elements
     * on the list from the multi-select filter in the given accordion,
     * validating that one or more results was returned by the presence of
     * `#list-inventory[data-total-count]`.
     *
     * @param {string} segmentName label for the segment we are testing
     * @param {string} segmentSelector selector for the segment we are testing
     * @param {string} accordionSelector selector for the accordion containing the filters
     * @param {string[]} list option-values
     */
    const multiSelectFilterTest = (segmentName, segmentSelector, accordionSelector, list) => {
      it(`should click "${segmentName}" to navigate there`, (done) => {
        nightmare
          .wait(segmentSelector)
          .click(segmentSelector)
          .wait('#paneHeaderpane-results-subtitle')
          .wait('span[class^="noResultsMessageLabel"]')
          .then(done)
          .catch(done);
      });

      it('should find "no results" message with no filters applied', (done) => {
        nightmare
          .wait('#paneHeaderpane-results-subtitle')
          .wait('span[class^="noResultsMessageLabel"]')
          .then(done)
          .catch(done);
      });

      list.forEach((filter) => {
        it(`should click ${filter} and find hit count`, (done) => {
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
              nightmare
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
        });
      });
    };

    /**
     * Navigate to the given segment, then tick and untick each of the
     * checkboxes in the list, validating that one or more results was
     * returned by the presence of `#list-inventory[data-total-count]`.
     *
     * @param {string} segmentName label for the segment we are testing
     * @param {string} segmentSelector selector for the segment we are testing
     * @param {string} accordionSelector selector for the accordion containing the filters
     * @param {string[]} list filter ids to be concatenated onto '#clickable-filter-'
     */
    const checkboxFilterTest = (segmentName, segmentSelector, accordionSelector, list) => {
      it(`should click "${segmentName}" to navigate there`, (done) => {
        nightmare
          .wait(segmentSelector)
          .click(segmentSelector)
          .wait('#paneHeaderpane-results-subtitle')
          .wait('span[class^="noResultsMessageLabel"]')
          .then(done)
          .catch(done);
      });

      it('should find "no results" message with no filters applied', (done) => {
        nightmare
          .wait('#paneHeaderpane-results-subtitle')
          .wait('span[class^="noResultsMessageLabel"]')
          .then(done)
          .catch(done);
      });

      list.forEach((filter) => {
        it(`should click ${filter} and find hit count`, (done) => {
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
        });
      });
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
        multiSelectFilterTest('instance', '#segment-navigation-instances', 'language', languageFilters);
      });

      describe('Should test holdings location filters', () => {
        multiSelectFilterTest('holdings', '#segment-navigation-holdings', 'holdingsPermanentLocation', locationFilters);
      });

      describe('Should test items item-status filters', () => {
        checkboxFilterTest('items', '#segment-navigation-items', 'itemFilterAccordion', itemStatusFilters);
      });

      it('should click the "item" segment filter', (done) => {
        nightmare
          .wait('#segment-navigation-items')
          .click('#segment-navigation-items')
          .wait('#paneHeaderpane-results-subtitle')
          .wait('span[class^="noResultsMessageLabel"]')
          .then(done)
          .catch(done);
      });
    });
  });
};
