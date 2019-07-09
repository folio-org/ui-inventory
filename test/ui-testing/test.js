// const newTitle = require('./new_title.js');
const filters = require('./filters.js');
const search = require('./search.js');
const newTitle = require('./new-title.js');

module.exports.test = function test(uiTestCtx) {
  newTitle.test(uiTestCtx);
  filters.test(uiTestCtx);
  search.test(uiTestCtx);
};
