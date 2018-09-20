/* global Nightmare describe it before after */
module.exports.test = function uiTest(uiTestCtx) {
  describe('Module test: inventory:new_title', function testDescribe() {
    const { config, helpers: { login, openApp, createInventory, logout }, meta: { testVersion } } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    this.timeout(Number(config.test_timeout));

    const title = '0';
    const ed = '[1st ed.]';
    const series = 'Catalogus (Museum van Hedendaagse Kunst Antwerpen), 92';
    const id = new Date().valueOf();
    const isbn = '9789072828279';
    const contrib = 'Moritz Küng';
    const subjects = ['Venlet, Richard -- Exhibitions', 'Installations (Art) -- Exhibitions', 'Installations (Art)'];
    const pub = { publisher: 'MUHKA', place: 'Antwerpen', date: '©2002' };
    const url = 'http://www.worldcat.org/title/00/oclc/921279647';
    const desc = '230 pages : chiefly illustrations (some color) ; 28 cm + 1 folded sheet';
    const lang = ['dut', 'eng'];
    const notes = ['Catalog of two exhibitions, "Paramount basics" held at the 25th Biennale of São Paulo, 23 March-2 June 2002, and "Paramount basics (extended)," held at MUHKA, Museum van Hedendaagse Kunst Antwerpen, 21 September-24 November 2002.', 'Cover title.', 'Includes folded sheet of list of works in the exhibition held at MUHKA.'];

    describe('Login > Open module "Inventory" > Create new instance > Sort list by title > Confirm creation of new title > Logout', () => {
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
      it('should create new instance ', (done) => {
        nightmare
          .wait('#clickable-newinventory')
          .click('#clickable-newinventory')
          .wait(55)
          .insert('input[name=title]', title)
          .insert('input[name=hrid]', id)
          .click('#clickable-add-edition')
          .insert('input[name="editions[0]"]', ed)
          .wait(55)
          .click('#clickable-add-series')
          .insert('input[name="series[0]"]', series)
          .wait(55)
          .click('#clickable-add-identifier')
          .wait(55)
          .insert('input[name="identifiers[0].value', id)
          .type('select[name="identifiers[0].identifierTypeId', 's')
          .click('#clickable-add-identifier')
          .wait(55)
          .insert('input[name="identifiers[1].value', isbn)
          .type('select[name="identifiers[1].identifierTypeId', 'ii')
          .type('#select_instance_type', 'o')
          .click('#clickable-add-contributor')
          .insert('input[name="contributors[0].name"', contrib)
          .type('select[name="contributors[0].contributorNameTypeId"]', 'P')
          .click('#clickable-add-subject')
          .insert('input[name="subjects[0]"]', subjects[0])
          .click('#clickable-add-subject')
          .insert('input[name="subjects[1]"]', subjects[1])
          .click('#clickable-add-subject')
          .insert('input[name="subjects[2]"]', subjects[2])
          .click('#clickable-add-publication')
          .wait(55)
          .insert('input[name="publication[0].publisher"]', pub.publisher)
          .insert('input[name="publication[0].place"]', pub.place)
          .insert('input[name="publication[0].dateOfPublication"]', pub.date)
          .click('#clickable-add-url')
          .wait(55)
          .insert('input[name="urls[0]"]', url)
          .click('#clickable-add-description')
          .wait(55)
          .insert('input[name="physicalDescriptions[0]"]', desc)
          .click('#clickable-add-language')
          .wait(55)
          .select('select[name="languages[0]"]', lang[0])
          .click('#clickable-add-language')
          .wait(55)
          .select('select[name="languages[1]"]', lang[1])
          .click('#clickable-add-notes')
          .wait(55)
          .insert('input[name="notes[0]"]', notes[0])
          .click('#clickable-add-notes')
          .wait(55)
          .insert('input[name="notes[1]"]', notes[1])
          .click('#clickable-add-notes')
          .wait(55)
          .insert('input[name="notes[2]"]', notes[2])
          .wait(55)
          .click('#clickable-create-instance')
          .wait('#clickable-new-holdings-record')
          .then(() => { done(); })
          .catch(done);
      });
      createInventory(nightmare, config, '', 1);
      it('should find new title in list ', (done) => {
        nightmare
          .wait('#list-inventory')
          // .xclick('//div[@role="presentation"][.="title"]')
          .wait(3000)
          .evaluate((titl) => {
            const sel = `#list-inventory div[role="listitem"]:nth-child(1) > a > div[title="${titl}"]`;
            const ti = document.querySelector(sel);
            if (ti === null) {
              throw new Error(`Can't find newly created title (${titl}) at top of sorted list with selector: ${sel}`);
            }
          }, title)
          .then(() => { done(); })
          .catch(done);
      });
    });
  });
};
