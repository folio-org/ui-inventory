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

    /**
     * Clear the search form, click the toggle-button for a multi-select filter,
     * click a single option from a multi-select filter, wait for results,
     * click the toggle-button for a multi-select filter, clear the search form.
     *
     * NOTE: the selectors in this test are very carefully crafted though it may
     * not appear so at first glance. The `<MultiSelection>` component in play
     * here renders its list under different elements depending on the size of
     * the screen (under `#OverlayContainer` <= 800px, under the given accordion
     * on wider screens). On a narrow screen containing multiple `<MultiSelection>`
     * components, this means the _only_ way to distinguish whether an option
     * belongs to the current accordion is the _absence_ of `hidden` on the
     * `[role=listbox]` element, an ancestor element to the options.
     *
     * Without checking for `[hidden]`, all the options from all the
     * `<MultiSelection>`s are returned in a single list, leading to incorrect
     * values being returned from the `evaluate` block.
     *
     * @param {string} accordionSelector
     * @param {string} filter
     * @param {*} done
     */
    const findMultiSelectFilteredResults = (accordionSelector, filter, done) => {
      // for toggling visibility of the menu
      const toggle = `section#${accordionSelector} button[class^=multiSelectToggleButton]`;

      nightmare
        .wait('#input-inventory-search')
        .type('#input-inventory-search', 0)
        .wait('#clickable-reset-all')
        .click('#clickable-reset-all')
        .wait(toggle)
        .click(toggle)
        .wait('[role=listbox]:not([hidden]) [role=option] [class^=optionSegment]')
        .evaluate((value) => {
          return Array.from(document.querySelectorAll('[role=listbox]:not([hidden]) [role=option] [class^=optionSegment]')).findIndex(e => e.textContent === value) + 1;
        }, filter)
        .then((filterIndex) => {
          nightmare
            .wait(`[role=listbox]:not([hidden]) [class^=multiSelect] [role=option]:nth-of-type(${filterIndex})`)
            .click(`[role=listbox]:not([hidden]) [class^=multiSelect] [role=option]:nth-of-type(${filterIndex})`)
            .wait('#list-inventory[data-total-count]')
            .click(toggle)
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
        const languageFilters = ['English', 'French'];

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
