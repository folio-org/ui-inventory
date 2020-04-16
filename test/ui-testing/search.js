/* global Nightmare describe it before after */
module.exports.test = function test(uiTestCtx) {
  describe('Module test: inventory:search', function startTest() {
    const { config, helpers: { login, openApp, logout }, meta: { testVersion } } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    this.timeout(Number(config.test_timeout));

    const contentWait = (t) => {
      const re = new RegExp(t, 'i');
      return !!(Array.from(
        document.querySelectorAll('#list-inventory div[role="row"] > a > div')
      ).find(e => re.test(e.textContent)));
    };

    describe('Login > Click inventory > Create 2 instance records > Conduct multiple searches > Logout\n', () => {
      const fragment = 'supercalifragilisticexpialidocious';
      const title1 = `${fragment} ${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`;
      const author1 = `author ${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`;

      const title2 = `title ${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`;
      const author2 = `${fragment} ${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`;

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

      it('should create inventory record', (done) => {
        nightmare
          .wait('#app-list-item-clickable-inventory-module')
          .click('#app-list-item-clickable-inventory-module')
          .wait('[data-test-inventory-instances] #paneHeaderpane-results [data-test-pane-header-actions-button]')
          .click('[data-test-inventory-instances] #paneHeaderpane-results [data-test-pane-header-actions-button]')
          .wait('#clickable-newinventory')
          .click('#clickable-newinventory')
          .wait('#input_instance_title')
          .insert('#input_instance_title', title1)
          .wait('#select_instance_type')
          .type('#select_instance_type', 'o')
          .click('#clickable-add-contributor')
          .wait('input[name="contributors[0].name"')
          .insert('input[name="contributors[0].name"', author1)
          .type('select[name="contributors[0].contributorNameTypeId"]', 'P')
          .type('select[name="contributors[0].contributorTypeId"]', 'Author')
          .wait('#clickable-save-instance')
          .click('#clickable-save-instance')
          .wait(() => !document.querySelector('#clickable-save-instance'))
          .wait('#clickable-new-holdings-record')
          .waitUntilNetworkIdle(500)
          .then(done)
          .catch(done);
      });

      it('should create inventory record', (done) => {
        nightmare
          .wait('#app-list-item-clickable-inventory-module')
          .click('#app-list-item-clickable-inventory-module')
          .wait('[data-test-inventory-instances] #paneHeaderpane-results [data-test-pane-header-actions-button]')
          .click('[data-test-inventory-instances] #paneHeaderpane-results [data-test-pane-header-actions-button]')
          .wait('#clickable-newinventory')
          .click('#clickable-newinventory')
          .wait('#input_instance_title')
          .insert('#input_instance_title', title2)
          .wait('#select_instance_type')
          .type('#select_instance_type', 'o')
          .click('#clickable-add-contributor')
          .wait('input[name="contributors[0].name"')
          .insert('input[name="contributors[0].name"', author2)
          .type('select[name="contributors[0].contributorNameTypeId"]', 'P')
          .type('select[name="contributors[0].contributorTypeId"]', 'Author')
          .wait('#clickable-save-instance')
          .click('#clickable-save-instance')
          .wait(() => !document.querySelector('#clickable-save-instance'))
          .wait('#clickable-new-holdings-record')
          .waitUntilNetworkIdle(500)
          .then(done)
          .catch(done);
      });

      it(`should search "All" for "${fragment}" and find multiple records`, (done) => {
        nightmare
          .wait('#app-list-item-clickable-inventory-module')
          .click('#app-list-item-clickable-inventory-module')
          .wait('#input-inventory-search')
          .insert('#input-inventory-search', fragment)
          .wait('#clickable-reset-all')
          .click('#clickable-reset-all')
          .insert('#input-inventory-search', fragment)
          .wait('button[type=submit]')
          .click('button[type=submit]')
          .wait('#list-inventory[data-total-count]')
          .wait(contentWait, title1)
          .wait(contentWait, author2)
          .then(done)
          .catch(done);
      });

      it('should click "reset all" button', (done) => {
        nightmare
          .wait('#clickable-reset-all')
          .click('#clickable-reset-all')
          .wait('#paneHeaderpane-results-subtitle')
          .wait('span[class^="noResultsMessageLabel"]')
          .then(done)
          .catch(done);
      });

      it(`should search "Title" for "${fragment}"`, (done) => {
        nightmare
          .wait('#input-inventory-search-qindex')
          .wait('#input-inventory-search')
          .insert('#input-inventory-search', fragment)
          .wait('#clickable-reset-all')
          .wait('button[type=submit]')
          .click('button[type=submit]')
          .wait('#list-inventory[data-total-count]')
          .wait(contentWait, title1)
          .then(done)
          .catch(done);
      });

      it('should click "reset all" button', (done) => {
        nightmare
          .wait('#clickable-reset-all')
          .click('#clickable-reset-all')
          .wait('#paneHeaderpane-results-subtitle')
          .wait('span[class^="noResultsMessageLabel"]')
          .then(done)
          .catch(done);
      });

      it(`should search "Title" for "${title1}"`, (done) => {
        nightmare
          .select('#input-inventory-search-qindex', 'title')
          .insert('#input-inventory-search', title1)
          .wait('#clickable-reset-all')
          .wait('button[type=submit]')
          .click('button[type=submit]')
          .wait('#list-inventory[data-total-count="1"]')
          .wait(contentWait, title1)
          .then(done)
          .catch(done);
      });

      it('should click "reset all" button', (done) => {
        nightmare
          .wait('#clickable-reset-all')
          .click('#clickable-reset-all')
          .wait('#paneHeaderpane-results-subtitle')
          .wait('span[class^="noResultsMessageLabel"]')
          .then(done)
          .catch(done);
      });

      it(`should search "Contributor" for "${fragment}"`, (done) => {
        nightmare
          .select('#input-inventory-search-qindex', 'contributor')
          .insert('#input-inventory-search', author2)
          .wait('#clickable-reset-all')
          .wait('button[type=submit]')
          .click('button[type=submit]')
          .wait('#list-inventory[data-total-count]')
          .wait(contentWait, author2)
          .then(done)
          .catch(done);
      });

      it('should click "reset all" button', (done) => {
        nightmare
          .wait('#clickable-reset-all')
          .click('#clickable-reset-all')
          .wait('#paneHeaderpane-results-subtitle')
          .wait('span[class^="noResultsMessageLabel"]')
          .then(done)
          .catch(done);
      });

      it(`should search "Contributor" for "${author2}"`, (done) => {
        nightmare
          .select('#input-inventory-search-qindex', 'contributor')
          .insert('#input-inventory-search', author2)
          .wait('#clickable-reset-all')
          .wait('button[type=submit]')
          .click('button[type=submit]')
          .wait('#list-inventory[data-total-count="1"]')
          .wait(contentWait, author2)
          .then(done)
          .catch(done);
      });
    });
  });
};
