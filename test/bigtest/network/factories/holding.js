import { faker } from '@bigtest/mirage';

import Factory from './application';

export default Factory.extend({
  id: faker.random.uuid(),
  permanentLocationId: faker.random.uuid(),
  hrid: () => Math.floor(Math.random() * 90000000) + 10000000,
  electronicAccess: [],
  formerIds: [],
  holdingsItems: [],
  holdingsStatements: [],
  holdingsStatementsForIndexes: [],
  holdingsStatementsForSupplements: [],
  notes: [],
  statisticalCodeIds: [],

  afterCreate(instance, server) {
    const item = server.create('item');
    instance.items = [item];
    instance.save();
  }
});
