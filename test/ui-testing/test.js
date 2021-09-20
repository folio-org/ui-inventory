// const newTitle = require('./new_title.js');
const filters = require('./filters');
const search = require('./search');
const newTitle = require('./new-title');

module.exports.test = function test(uiTestCtx) {
  newTitle.test(uiTestCtx);
  filters.test(uiTestCtx);
  search.test(uiTestCtx);
};
