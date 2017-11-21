module.exports.test = function(uiTestCtx) {

  describe('Module test: inventory:new_title', function() {
    const { config, helpers: { login, openApp, logout }, meta: { testVersion } } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    this.timeout(Number(config.test_timeout));

    const title = '00'
    const ed = '[1st ed.]'
    const series = 'Catalogus (Museum van Hedendaagse Kunst Antwerpen), 92'
    const id = new Date().valueOf()
    const isbn = '9789072828279'
    const author = 'Venlet, Richard'
    const contrib = 'Moritz Küng'
    const subjects = ['Venlet, Richard -- Exhibitions', 'Installations (Art) -- Exhibitions', 'Installations (Art)']
    const pub = { 'publisher':'MUHKA', 'place':'Antwerpen', 'date':'©2002' }
    const url = 'http://www.worldcat.org/title/00/oclc/921279647'
    const desc = '230 pages : chiefly illustrations (some color) ; 28 cm + 1 folded sheet'
    const lang = ['dut', 'eng']
    const notes = ['Catalog of two exhibitions, "Paramount basics" held at the 25th Biennale of São Paulo, 23 March-2 June 2002, and "Paramount basics (extended)," held at MUHKA, Museum van Hedendaagse Kunst Antwerpen, 21 September-24 November 2002.', 'Cover title.', 'Includes folded sheet of list of works in the exhibition held at MUHKA.' ]

    describe('Login > Open module "Inventory" > Create new instance > Sort list by title > Confirm creation of new title > Logout', () => {
      before( done => {
        login(nightmare, config, done);  // logs in with the default admin credentials
      })
      after( done => {
        logout(nightmare, config, done);
      })
      it('should open module "Inventory" and find version tag ', done => {
        nightmare
        .use(openApp(nightmare, config, done, 'inventory', testVersion))
        .then(result => result )
      })
      it('should create new instance ', done => {
        nightmare
        .wait('#clickable-new-instance')
        .click('#clickable-new-instance')
	.wait(55)
        .insert('input[name=title]', title)
	.insert('#input_instance_edition', ed)
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
        .click('#clickable-add-creator')
	.wait(55)
        .insert('#input_creator_name_0', author)
        .type('#select_creator_type_0', 'P')
        .type('#select_instance_type', 'B')
	.click('#clickable-add-contributor')
	.insert('input[name="contributors[0].name"', contrib)
	.type('select[name="contributors[0].contributorTypeId"]', 'r')
        .click('#clickable-add-subject')
	.insert('input[name="subjects[0]"]', subjects[0])
        .click('#clickable-add-subject')
	.insert('input[name="subjects[1]"]', subjects[1])
        .click('#clickable-add-subject')
	.insert('input[name="subjects[2]"]', subjects[2])
        //.click('#clickable-add-classification')
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
	.wait(2222)
        .then(result => { done() } )
	.catch(done)
      }) 
      it('should find new title in list ', done => {
        nightmare
        .wait('#list-instances')
        .xclick('//div[@role="presentation"][.="title"]')
        .wait(3111)
        .evaluate(function(title) {
            var ti = document.querySelector('#list-instances > div[class^="scrollable"] > div > div > div > div[title="' + title + '"]')
            if (ti == null) {
              throw new Error("Can't find newly created title (" + title + ") at top of sorted list")
            }
        }, title)
        .then(result => { done() } )
        .catch(done)
      })
    })
  })
}

