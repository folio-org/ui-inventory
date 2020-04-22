import {
  faker,
  trait
} from '@bigtest/mirage';

import Factory from './application';

const {
  lorem,
  name,
  date,
} = faker;

export default Factory.extend({
  title: () => lorem.sentence(),
  contributors: () => [{ name: `${name.lastName()}, ${name.firstName()}` }],
  source: () => 'FOLIO',
  identifiers: () => [],
  publication: () => [],
  alternativeTitles: () => [],
  series: () => [],
  physicalDescriptions: () => [],
  languages: () => [],
  notes: () => [],
  electronicAccess: () => [],
  subjects: () => [],
  classifications: () => [],
  childInstances: () => [],
  parentInstances: () => [],
  statisticalCodeIds: () => [],
  hrid: i => `in0000000000${i + 1}`,
  metadata: {
    createdDate: date.between('2019-01-01', '2020-01-01'),
    updatedDate: date.between('2019-01-01', '2020-01-01'),
  },

  afterCreate(instance, server) {
    instance.identifiers.forEach(identifier => {
      let { identifierTypeId } = identifier;
      if (!identifierTypeId) {
        let [issn] = server.db.identifierTypes.where({ name: 'issn' });
        if (!issn) {
          issn = server.create('identifier-type', { name: 'issn' });
        }
        identifierTypeId = issn.id;
      }
      identifier.identifierTypeId = identifierTypeId;
    });
    instance.contributors.forEach(contributor => {
      let { contributorNameTypeId } = contributor;
      if (!contributorNameTypeId) {
        let [type] = server.db.contributorNameTypes.where({ name: 'Personal name' });
        if (!type) {
          type = server.create('contributor-name-type', { name: 'Personal name' });
        }
        contributorNameTypeId = type.id;
      }
      contributor.contributorNameTypeId = contributorNameTypeId;
    });
  },

  withStatisticalCodeIds: trait({
    afterCreate(instance) {
      instance.statisticalCodeIds = [
        'b5968c9e-cddc-4576-99e3-8e60aed8b0dd',
        '30b5400d-0b9e-4757-a3d0-db0d30a49e72',
        '2850630b-cd12-4379-af57-5c51491a6873',
      ];
    }
  }),

  withAlternativeTitles: trait({
    afterCreate(instance) {
      instance.alternativeTitles = [{
        alternativeTitle: lorem.sentence(),
        alternativeTitleTypeId: '09964ad1-7aed-49b8-8223-a4c105e3ef87',
      }];
    }
  }),

  withSubjects: trait({
    afterCreate(instance) {
      instance.subjects = [lorem.sentence()];
    }
  }),

  withSeriesStatement: trait({
    afterCreate(instance) {
      instance.series = [lorem.sentence()];
    }
  }),

  withNotes: trait({
    afterCreate(instance, server) {
      instance.notes = [
        {
          note: lorem.sentence(),
          staffOnly: false,
        },
        {
          note: lorem.sentence(),
          staffOnly: true,
        }
      ];

      instance.notes.forEach(note => {
        let { instanceNoteTypeId } = note;
        if (!instanceNoteTypeId) {
          let [type] = server.db.instanceNoteTypes.where({ name: 'General note' });
          if (!type) {
            type = server.create('instance-note-type', {
              name: 'General note',
              source: 'folio',
              metadata: {
                createdDate: new Date(),
                updatedDate: new Date(),
              },
            });
          }
          instanceNoteTypeId = type.id;
        }
        note.instanceNoteTypeId = instanceNoteTypeId;
      });
    }
  }),

  withPrecedingTitle: trait({
    afterCreate(instance) {
      instance.parentInstances = [{ id: '1008409091', superInstanceId: '9999999', instanceRelationshipTypeId: 'cde80cc2-0c8b-4672-82d4-721e51dcb990' }];
    }
  }),

  withSucceedingTitle: trait({
    afterCreate(instance) {
      instance.childInstances = [{ id: '1008409092', subInstanceId: '8888888', instanceRelationshipTypeId: 'cde80cc2-0c8b-4672-82d4-721e51dcb990' }];
    }
  }),

  withHolding: trait({
    afterCreate(instance, server) {
      const holding = server.create('holding');
      instance.holdings = [holding];
      instance.save();
    }
  }),

  withHoldingAndItem: trait({
    afterCreate(instance, server) {
      const holding = server.create(
        'holding',
        'withItem',
        'withElectronicAccess',
      );
      instance.holdings = [holding];
      instance.save();
    }
  }),

  withHoldingAndPagedItem: trait({
    afterCreate(instance, server) {
      const holding = server.create('holding', 'withPagedItem');
      instance.holdings = [holding];
      instance.save();
    }
  }),

  withHoldingAndInProcessItem: trait({
    afterCreate(instance, server) {
      const holding = server.create('holding');
      const item = server.create('item', { status: { name: 'In process' } });

      holding.items = [item];
      holding.save();
      instance.holdings = [holding];
      instance.save();
    }
  })
});
