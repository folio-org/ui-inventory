import { faker } from '@bigtest/mirage';

import Factory from './application';

export default Factory.extend({
  id: faker.random.uuid(),
  title: faker.company.catchPhrase(),
  hrid: () => Math.floor(Math.random() * 90000000) + 10000000,
  barcode: () => Math.floor(Math.random() * 9000000000000) + 1000000000000,
  status: {
    name: 'Available'
  },
  formerIds: [],
  discoverySuppress: null,
  copyNumbers: [],
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
});
