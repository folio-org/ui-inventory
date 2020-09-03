import faker from 'faker';

import Factory from './application';

export default Factory.extend({
  code: () => faker.random.word(),
  name: () => faker.random.words(),
});
