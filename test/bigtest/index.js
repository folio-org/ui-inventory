import 'babel-polyfill';

// can be removed when this PR is merged and released.
// https://github.com/pretenderjs/FakeXMLHttpRequest/pull/43
import './helpers/stripes-connect-mirage-compat';

// require all modules ending in "-test" from the current directory and
// all subdirectories
const requireTest = require.context('./tests/', true, /-test/);
requireTest.keys().forEach(requireTest);
