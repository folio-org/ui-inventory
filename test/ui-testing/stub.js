/* global Nightmare describe it before after */
module.exports.test = function test(uiTestCtx) {
  describe('Module test: instances:stub', function startTest() {
    const { config, helpers: { login, openApp, logout }, meta: { testVersion } } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    this.timeout(Number(config.test_timeout));

    describe('Login > Open module "Instances" > Logout', () => {
      before((done) => {
        login(nightmare, config, done); // logs in with the default admin credentials
      });
      after((done) => {
        logout(nightmare, config, done);
      });
      it('should open module "Instances" and find version tag ', (done) => {
        nightmare
          .use(openApp(nightmare, config, done, 'instances', testVersion))
          .then(result => result);
      });
    });
  });
};
