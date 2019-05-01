// const newTitle = require('./new_title.js');
const filters = require('./filters.js');
const inventorySearch = require('./inventorySearch.js');

module.exports.test = function test(uiTestCtx) {
  // newTitle.test(uiTestCtx);
  filters.test(uiTestCtx);
  inventorySearch.test(uiTestCtx);
};
