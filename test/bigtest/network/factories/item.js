import faker from 'faker';

import Factory from './application';

export default Factory.extend({
  id: faker.random.uuid(),
  title: faker.company.catchPhrase(),
  hrid: () => Math.floor(Math.random() * 90000000) + 10000000,
  barcode: () => Math.floor(Math.random() * 9000000000000) + 1000000000000,
  callNumber: () => `callNumber - ${faker.random.uuid()}`,
  status: {
    name: 'Available'
  },
  formerIds: [],
  discoverySuppress: null,
  copyNumber: '',
  notes: [],
  circulationNotes: [],
  yearCaption: [],
  electronicAccess: [],
  statisticalCodeIds: [],
  purchaseOrderLineIdentifier: null,
  materialType: {
    id: faker.random.uuid(),
    name: 'book'
  },
  permanentLoanType: {
    id: faker.random.uuid(),
    name: 'Can circulate'
  },
  effectiveLocation: {
    id: faker.random.uuid(),
    name: 'Main Library'
  },
  links: {},
  lastCheckIn: {},

  afterCreate(instance, server) {
    const user = server.create('user');
    const servicePoint = server.create('service-point');

    instance.lastCheckIn = {
      dateTime: '2019-12-12T14:28:07.000Z',
      staffMemberId: user.id,
      servicePointId: servicePoint.id,
    };
  }
});
