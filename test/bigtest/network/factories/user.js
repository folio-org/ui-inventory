import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  username: () => faker.internet.userName()
});
