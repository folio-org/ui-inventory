import faker from 'faker';
import { trait } from 'miragejs';

import Factory from './application';

const {
  lorem,
  random,
  internet,
} = faker;

export default Factory.extend({
  id: () => random.uuid(),
  permanentLocationId: 'fcd64ce1-6995-48f0-840e-89ffa2288371',
  hrid: i => `ho0000000000${i + 1}`,
  electronicAccess: () => [],
  callNumberPrefix: () => `prefix - ${random.uuid()}`,
  callNumber: () => `callNumber - ${random.uuid()}`,
  callNumberSuffix: () => `suffix - ${random.uuid()}`,
  formerIds: [],
  holdingsItems: [],
  holdingsStatements: [
    {
      statement: lorem.sentence(),
      note: lorem.sentence(),
    },
  ],
  holdingsStatementsForIndexes: [
    {
      statement: lorem.sentence(),
      note: lorem.sentence(),
    },
    {
      statement: lorem.sentence(),
      note: lorem.sentence(),
    },
  ],
  holdingsStatementsForSupplements: [
    {
      statement: lorem.sentence(),
      note: lorem.sentence(),
    },
  ],
  notes: [
    {
      note: '',
      staffOnly: true,
    },
    {
      note: lorem.sentence(),
      staffOnly: false,
    },
  ],
  statisticalCodeIds: [
    'c7a32c50-ea7c-43b7-87ab-d134c8371330',
    '9d8abbe2-1a94-4866-8731-4d12ac09f7a8',
  ],

  afterCreate(holding, server) {
    holding.notes.forEach(note => {
      let { holdingsNoteTypeId } = note;
      if (!holdingsNoteTypeId) {
        let [type] = server.db.holdingsNoteTypes.where({ name: 'Note' });
        if (!type) {
          type = server.create('holdings-note-type', {
            name: 'Note',
            source: 'folio',
            metadata: {
              createdDate: new Date(),
              updatedDate: new Date(),
            },
          });
        }
        holdingsNoteTypeId = type.id;
      }
      note.holdingsNoteTypeId = holdingsNoteTypeId;
    });
  },

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
  }),

  withElectronicAccess: trait({
    afterCreate(holding, server) {
      holding.electronicAccess = [{
        linkText: lorem.sentence(),
        materialsSpecification: lorem.sentence(),
        publicNote: '',
        uri: internet.url(),
      }];
      holding.electronicAccess.forEach(item => {
        let { relationshipId } = item;
        if (!relationshipId) {
          let [type] = server.db.electronicAccessRelationships.where({ name: 'Resource' });
          if (!type) {
            type = server.create('electronic-access-relationship', {
              name: 'Resource',
              source: 'folio',
              metadata: {
                createdDate: new Date(),
                updatedDate: new Date(),
              },
            });
          }
          relationshipId = type.id;
        }
        item.relationshipId = relationshipId;
      });
    }
  }),
});
