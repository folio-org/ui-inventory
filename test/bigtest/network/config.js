import CQLParser, { CQLBoolean } from './cql';

// typical mirage config export
export default function configure() {
  // users
  this.get('/users', ({ users }, request) => {
    if (request.queryParams.query) {
      const cqlParser = new CQLParser();
      cqlParser.parse(request.queryParams.query);
      return users.where({
        id: cqlParser.tree.term
      });
    } else {
      return [];
    }
  });

  this.get('/instance-types', ({ instanceTypes }) => {
    return instanceTypes.all();
  });

  this.get('/instance-types/:id');

  this.get('/instance-formats');
  this.get('/instance-formats/:id');

  this.get('/nature-of-content-terms');
  this.get('/nature-of-content-terms/:id');

  this.get('/instance-statuses');
  this.get('/instance-statuses/:id');

  this.get('/identifier-types');
  this.get('/identifier-types/:id');

  this.get('/contributor-types');
  this.get('/contributor-types/:id');

  this.get('/contributor-name-types');
  this.get('/contributor-name-types/:id');

  this.get('/classification-types');
  this.get('/classification-types/:id');

  this.get('/instance-relationship-types');
  this.get('/instance-relationship-types/:id');

  this.get('/item-damaged-statuses', {
    'itemDamageStatuses': [
      {
        'id': '54d1dd76-ea33-4bcb-955b-6b29df4f7930',
        'name': 'Damaged',
        'source': 'local'
      },
      {
        'id': '516b82eb-1f19-4a63-8c48-8f1a3e9ff311',
        'name': 'Not Damaged',
        'source': 'local'
      }
    ],
    'totalRecords': 2
  });
  this.get('/item-damaged-statuses/:id');

  this.get('/record-bulk/ids', {});
  this.post('/data-export/quick-export', {});

  this.get('/modes-of-issuance', ({ issuanceModes }) => issuanceModes.all());
  this.get('/modes-of-issuance/:id', ({ issuanceModes }, { params }) => {
    return issuanceModes.find(params.id);
  });

  this.get('/electronic-access-relationships');
  this.get('/electronic-access-relationships/:id');

  this.get('/statistical-code-types', {
    statisticalCodeTypes: [{
      id: '0d3ec58e-dc3c-4aa1-9eba-180fca95c544',
      name: 'RECM (Record management)',
      source: 'folio'
    }, {
      id: 'e2ab27f9-a726-4e5e-9963-fff9e6128680',
      name: 'SERM (Serial management)',
      source: 'folio'
    }],
    totalRecords: 2
  });
  this.get('/statistical-code-types/:id');

  this.get('/statistical-codes', {
    statisticalCodes: [{
      id: 'c7a32c50-ea7c-43b7-87ab-d134c8371330',
      code: 'ASER',
      name: 'Active serial',
      statisticalCodeTypeId: 'e2ab27f9-a726-4e5e-9963-fff9e6128680',
      source: 'UC'
    }, {
      id: 'b6b46869-f3c1-4370-b603-29774a1e42b1',
      code: 'arch',
      name: 'Archives (arch)',
      statisticalCodeTypeId: '0d3ec58e-dc3c-4aa1-9eba-180fca95c544',
      source: 'UC'
    }],
    totalRecords: 2
  });

  this.get('/alternative-title-types');
  this.get('/statistical-title-types/:id');

  this.get('/inventory/instances', (schema, request) => {
    const {
      instances,
      holdings,
      items,
      identifierTypes,
    } = schema;

    if (request.queryParams.query) {
      const cqlParser = new CQLParser();
      cqlParser.parse(request.queryParams.query);
      const {
        field,
        term,
        left,
        right,
      } = cqlParser.tree;

      if (left?.field === 'metadata.createdDate' && right?.field === 'metadata.createdDate') {
        return instances.all().filter(inst => {
          const createdDate = new Date(inst.metadata.createdDate);
          const from = new Date(left.term);
          const to = new Date(right.term);

          return createdDate >= from && createdDate < to;
        });
      }

      if (left?.field === 'metadata.updatedDate' && right?.field === 'metadata.updatedDate') {
        return instances.all().filter(inst => {
          const updatedDate = new Date(inst.metadata.updatedDate);
          const from = new Date(left.term);
          const to = new Date(right.term);

          return updatedDate >= from && updatedDate < to;
        });
      }

      if (left?.field === 'title' && right?.field === 'contributors') {
        return instances.all().filter(inst => inst.title.match(left.term) &&
          inst.contributors[0].name.match(right.term));
      }

      // With the addition of a third condition to search for records by 'Holdings. Call number readable by eye" in the CQL query,
      // cqlParser.tree object gets a deeper structure in the 'left' and 'right' properties.
      if (left?.left?.field === 'holdingsRecords.fullCallNumber') {
        const holding = holdings.where({ callNumber: left.left.term }).models[0];

        return instances.where({ id: holding.instanceId });
      }

      if (left?.field === 'holdingsRecords.fullCallNumberNormalized') {
        const normalize = value => value.replace(/\W/g, '').toLowerCase();

        const normalizedHoldings = holdings.all().models.map(holding => {
          const { instanceId, callNumber, callNumberPrefix } = holding;
          return { instanceId, callNumber: normalize(callNumberPrefix + callNumber) };
        });

        const holding = normalizedHoldings.find(h => h.callNumber === normalize(left.term));

        return instances.where({ id: holding?.instanceId });
      }

      // With the addition of a third condition to search for records by 'Item. Effective call number eye readable" in the CQL query,
      // cqlParser.tree object gets a deeper structure in the 'left' and 'right' properties.
      if (left?.left?.field === 'item.fullCallNumber') {
        const item = items.where({ callNumber: left.left.term }).models[0];
        const holding = holdings.where({ id: item.holdingsRecordId }).models[0];

        return instances.where({ id: holding.instanceId });
      }

      if (left?.field === 'item.fullCallNumberNormalized') {
        const item = items.where({ callNumber: left.term }).models[0];
        const holding = holdings.where({ id: item.holdingsRecordId }).models[0];

        return instances.where({ id: holding.instanceId });
      }

      if (field === 'source') return instances.where({ source: term });

      if (field === 'identifiers') {
        const idType = identifierTypes.where({ name: term }).models[0];

        return instances.all().filter(inst => inst.identifiers.length &&
          inst.identifiers[0].identifierTypeId === idType.id);
      }

      if (left?.field === 'isbn' && right?.field === 'invalidIsbn') {
        const groupPattern = /^([0-9\s-]*)(.*)/;
        const removePattern = /[-\s]+/g;

        return instances.all().filter(
          inst => inst.identifiers[0]?.value?.replace(groupPattern, '$1').replace(removePattern, '') === left.term ||
            inst.identifiers[1]?.value?.replace(groupPattern, '$1').replace(removePattern, '') === right.term
        );
      }

      if (field === 'item.barcode') {
        const item = items.where({ barcode: term }).models[0];
        const holding = holdings.where({ id: item.holdingsRecordId }).models[0];

        return instances.where({ id: holding.instanceId });
      }

      if (field === 'item.materialTypeId') {
        const item = items.all().models.find(it => it.materialType.id === term);
        const holding = holdings.where({ id: item.holdingsRecordId }).models[0];

        return instances.where({ id: holding.instanceId });
      }

      if (field === 'item.status.name') {
        const item = items.all().models.find(it => it.status.name === term);
        const holding = holdings.where({ id: item.holdingsRecordId }).models[0];

        return instances.where({ id: holding.instanceId });
      }

      if (field === 'hrid') return instances.where({ hrid: term });

      if (field === 'id') return instances.where({ id: term });

      if (field === 'holdingsRecords.hrid') {
        const holding = holdings.where({ hrid: term }).models[0] || {};

        return instances.where({ id: holding.instanceId });
      }

      if (field === 'item.hrid') {
        const item = items.where({ hrid: term }).models[0] || {};
        const holding = holdings.where({ id: item.holdingsRecordId }).models[0] || {};

        return instances.where({ id: holding.instanceId });
      }

      if (!term) return instances.all();
    }

    return instances.all();
  });

  this.get('/inventory/instances/:id', (schema, { params }) => {
    return schema.instances.find(params.id);
  });

  this.put('/inventory/instances/:id', ({ instances }, request) => {
    const { id } = JSON.parse(request.requestBody);
    return instances.find(id);
  });

  this.get('/locations', {
    locations: [
      {
        id: '53cf956f-c1df-410b-8bea-27f712cca7c0',
        name: 'Annex',
        code: 'KU/CC/DI/A',
        isActive: true,
        institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
        campusId: '62cf76b7-cca5-4d33-9217-edf42ce1a848',
        libraryId: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
        primaryServicePoint: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
        servicePointIds: [
          '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
        ],
      },
      {
        id: 'fcd64ce1-6995-48f0-840e-89ffa2288371',
        name: 'Main Library',
        code: 'KU/CC/DI/M',
        isActive: true,
        institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
        campusId: '62cf76b7-cca5-4d33-9217-edf42ce1a848',
        libraryId: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
        primaryServicePoint: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
        servicePointIds: [
          '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
        ],
      },
      {
        id: '758258bc-ecc1-41b8-abca-f7b610822ffd',
        name: 'ORWIG ETHNO CD',
        code: 'KU/CC/DI/O',
        isActive: true,
        institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
        campusId: '62cf76b7-cca5-4d33-9217-edf42ce1a848',
        libraryId: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
        primaryServicePoint: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
        servicePointIds: [
          '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
        ],
      },
      {
        id: 'b241764c-1466-4e1d-a028-1a3684a5da87',
        name: 'Popular Reading Collection',
        code: 'KU/CC/DI/P',
        isActive: true,
        institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
        campusId: '62cf76b7-cca5-4d33-9217-edf42ce1a848',
        libraryId: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
        primaryServicePoint: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
        servicePointIds: [
          '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
        ],
      },
      {
        id: 'f34d27c6-a8eb-461b-acd6-5dea81771e70',
        name: 'SECOND FLOOR',
        code: 'KU/CC/DI/2',
        isActive: true,
        institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
        campusId: '62cf76b7-cca5-4d33-9217-edf42ce1a848',
        libraryId: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
        primaryServicePoint: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
        servicePointIds: [
          '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
        ],
      },
    ],
    totalRecords: 5,
  });
  this.get('/locations/:id', {});

  // item-storage
  this.get('/service-points', {
    servicepoints: [{
      name: 'Circ Desk 1',
      id: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
    }],
    totalRecords: 1
  });

  this.get('/inventory/items', ({ items }, request) => {
    if (request.queryParams.query) {
      const cqlParser = new CQLParser();
      cqlParser.parse(request.queryParams.query);
      const { field, term } = cqlParser.tree;

      if (field && term) {
        return items.where({ [field]: term });
      }
    }

    return {
      items: [
        {
          id: '7abd8dfe-0234-4256-b2e6-539499999cac',
          status: {
            name: 'Checked out',
          },
          title: '14 cows for America',
          hrid: 'it00000168',
          contributorNames: [
            {
              name: 'Deedy, Carmen Agra.',
            },
            {
              name: 'Naiyomah, Wilson Kimeli.',
            },
            {
              name: 'Gonzalez, Thomas',
            },
          ],
          formerIds: [],
          discoverySuppress: null,
          holdingsRecordId: '44a21d17-a666-4f34-b24d-644f8ed1537b',
          barcode: '5860825104574',
          copyNumber: '',
          notes: [],
          circulationNotes: [],
          numberOfPieces: '3',
          yearCaption: [],
          electronicAccess: [],
          statisticalCodeIds: [],
          purchaseOrderLineIdentifier: null,
          materialType: {
            id: '1a54b431-2e4f-452d-9cae-9cee66c9a892',
            name: 'book',
          },
          permanentLoanType: {
            id: '2b94c631-fca9-4892-a730-03ee529ffe27',
            name: 'Can circulate',
          },
          metadata: {
            createdDate: '2019-04-11T03:34:21.745+0000',
            createdByUserId: '834408d0-5f11-5278-8945-4508aadf94b6',
            updatedDate: '2019-04-11T12:01:48.451+0000',
            updatedByUserId: '834408d0-5f11-5278-8945-4508aadf94b6',
          },
          effectiveLocation: {
            id: 'fcd64ce1-6995-48f0-840e-89ffa2288371',
            name: 'Main Library',
          },
        },
      ],
      totalRecords: 1,
    };
  });

  this.get('/inventory/items/:id', ({ items }, { params }) => {
    return items.find(params.id);
  });

  this.put('/inventory/items/:id', ({ items }, request) => {
    const {
      id,
      name,
      description,
      status,
    } = JSON.parse(request.requestBody);
    const item = items.find(id);

    item.update({ name, description, status });

    return item.attrs;
  });

  this.post('/inventory/items/:id/mark-withdrawn', ({ items }, request) => {
    const item = items.find(request.params.id);

    item.update({ status: { name: 'Withdrawn' } });

    return item.attrs;
  });

  this.post('/inventory/items/:id/mark-missing', ({ items }, request) => {
    const item = items.find(request.params.id);

    item.update({ status: { name: 'Missing' } });

    return item.attrs;
  });

  this.post('/inventory/items/:id/mark-intellectual-item', ({ items }, request) => {
    const item = items.find(request.params.id);

    item.update({ status: { name: 'Intellectual item' } });

    return item.attrs;
  });

  this.post('/inventory/items/:id/mark-restricted', ({ items }, request) => {
    const item = items.find(request.params.id);

    item.update({ status: { name: 'Restricted' } });

    return item.attrs;
  });

  this.post('/inventory/items/:id', ({ items }, request) => {
    const body = JSON.parse(request.requestBody);
    const item = items.create(body);

    return item.attrs;
  });

  this.get('/circulation/loans', ({ loans }, request) => {
    if (request.queryParams.query) {
      const cqlParser = new CQLParser();
      cqlParser.parse(request.queryParams.query);
      if (cqlParser.tree instanceof CQLBoolean) {
        return loans.where({
          itemId: cqlParser.tree.left.term
        });
      } else {
        return loans.where({
          itemId: cqlParser.tree.term
        });
      }
    } else {
      return loans.all();
    }
  });

  this.put('/circulation/loans/:id', (_, request) => {
    return JSON.parse(request.requestBody);
  });

  this.get('/holdings-storage/holdings', ({ holdings }, request) => {
    if (request.queryParams.query) {
      const cqlParser = new CQLParser();
      cqlParser.parse(request.queryParams.query);
      const { field, term } = cqlParser.tree;

      if (field && term) {
        return holdings.where({ [field]: term });
      }
    }

    return {
      holdingsRecords: [
        {
          id: '44a21d17-a666-4f34-b24d-644f8ed1537b',
          hrid: 'ho00000111',
          formerIds: [],
          instanceId: '7a8f9775-8de3-4308-8323-b055c104e0f3',
          permanentLocationId: 'fcd64ce1-6995-48f0-840e-89ffa2288371',
          electronicAccess: [],
          notes: [],
          holdingsStatements: [],
          holdingsStatementsForIndexes: [],
          holdingsStatementsForSupplements: [],
          statisticalCodeIds: [],
          holdingsItems: [],
          metadata: {
            createdDate: '2019-04-11T03:34:20.887+0000',
            createdByUserId: '834408d0-5f11-5278-8945-4508aadf94b6',
            updatedDate: '2019-04-11T03:34:20.887+0000',
            updatedByUserId: '834408d0-5f11-5278-8945-4508aadf94b6',
          },
        },
      ],
      totalRecords: 1,
    };
  });

  this.get('/holdings-storage/holdings/:id', ({ holdings }, { params }) => {
    return holdings.find(params.id);
  });

  this.get('/circulation/requests', {
    requests: [],
    totalRecords: 0
  });

  this.put('/circulation/requests/:id', ({ requests }, { requestBody }) => {
    const { id, status } = JSON.parse(requestBody);
    const request = requests.find(id);

    request.update({ status });

    return request.attrs;
  });

  this.get('/service-points-users', {
    servicePointsUsers: [],
    totalRecords: 0
  });

  this.get('/staff-slips-storage/staff-slips', {});
  this.get('/groups', {});
  this.get('/addresstypes', {});
  this.get('/users/:id', {});
  this.get('/perms/users/:id/permissions', {});

  this.get('/holdings-types', {
    holdingsTypes: [],
    totalRecords: 0
  });

  this.get('/instance-note-types');
  this.get('/instance-note-types/:id');

  this.get('/holdings-note-types');
  this.get('/holdings-note-types/:id');

  this.get('/holdings-sources');
  this.get('/holdings-sources/:id');

  this.get('/item-note-types');
  this.get('/item-note-types/:id');

  this.get('/ill-policies', {
    illPolicies: [],
    totalRecords: 0
  });

  this.get('/call-number-types', {
    callNumberTypes: [],
    totalRecords: 0
  });

  this.get('/material-types');

  this.get('/loan-types', {
    loantypes: [],
    totalRecords: 0
  });

  this.get('/source-storage/records', {
    records: [],
    totalRecords: 0
  });
  this.get('/source-storage/records/:id/formatted', {});

  this.get('/inventory/config/instances/blocked-fields');

  this.get('/source-storage/records/:id/formatted', {
    instanceTypes: [],
    totalRecords: 0
  });

  this.get('/inventory-reports/items-in-transit', {
    items: [
      {
        id: '7212ba6a-8dcf-45a1-be9a-ffaa847c4423',
        title: 'A semantic web primer',
        barcode: '10101',
        contributors: [{ 'name': 'Antoniou, Grigoris' }],
        callNumber: 'TK5105.88815 . A58 2004 FT MEADE',
        status: { name: 'In transit' },
        inTransitDestinationServicePointId: 'c4c90014-c8c9-4ade-8f24-b5e313319f4b',
        inTransitDestinationServicePoint: {
          id: 'c4c90014-c8c9-4ade-8f24-b5e313319f4b',
          name: 'Circ Desk 2'
        },
        location: {
          name: 'Main Library',
          code: 'KU/CC/DI/M',
          libraryName: 'Datalogisk Institut'
        },
        request: {
          requestType: 'Hold',
          requestDate: '2019-11-13T11:23:16.000Z',
          requestPickupServicePointName: 'Circ Desk 2',
          requestPatronGroup: 'Kovacek, Meredith'
        },
        loan: {
          checkInServicePoint: {
            name: 'Online',
            code: 'Online',
            discoveryDisplayName: 'Online',
            shelvingLagTime: 0,
            pickupLocation: false
          },
          checkInDateTime: '2019-11-11T19:19:49.000Z'
        }
      }],
    totalRecords: 1
  });

  this.get('/tags', {
    tags: [],
    totalRecords: 0
  });
}
