module.exports.test = function(uiTestCtx) {

  describe('Module test: instances:stub', function() {
    const { config, helpers: { login, openApp, logout }, meta: { testVersion } } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    this.timeout(Number(config.test_timeout));

    const title = '0000000 : a new test title'

    describe('Login > Open module "Instances" > Create new instance > Sort list by title > Confirm creation of new title > Logout', () => {
      before( done => {
        login(nightmare, config, done);  // logs in with the default admin credentials
      })
      after( done => {
        logout(nightmare, config, done);
      })
      it('should open module "Instances" and find version tag ', done => {
        nightmare
        .use(openApp(nightmare, config, done, 'instances', testVersion))
        .then(result => result )
      })
      it('should create new instance ', done => {
        nightmare
        .wait('#clickable-new-instance')
        .click('#clickable-new-instance')
        .wait(222)
        .insert('input[name=title]', title)
        .wait(222)
        .click('#clickable-create-instance')
        .then(result => { done() } )
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

