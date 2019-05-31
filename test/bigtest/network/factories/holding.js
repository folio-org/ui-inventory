import { faker, trait } from '@bigtest/mirage';

import Factory from './application';

export default Factory.extend({
  id: faker.random.uuid(),
  permanentLocationId: 'fcd64ce1-6995-48f0-840e-89ffa2288371',
  hrid: () => Math.floor(Math.random() * 90000000) + 10000000,
  electronicAccess: [],
  formerIds: [],
  holdingsItems: [],
  holdingsStatements: [],
  holdingsStatementsForIndexes: [],
  holdingsStatementsForSupplements: [],
  notes: [],
  statisticalCodeIds: [],

  withItem: trait({
    afterCreate(holding, server) {
      const item = server.create('item');
      holding.items = [item];
      holding.save();
      item.save();
    }
  }),

  withPagedItem: trait({
    afterCreate(holding, server) {
      const item = server.create('item', { status: { name: 'Paged' } });
      holding.items = [item];
      holding.save();
    }
  })
});
