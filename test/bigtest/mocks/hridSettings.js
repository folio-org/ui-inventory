import faker from 'faker';

import formatDateString from '../helpers/formatDateString';

const hridSettings = {
  id: '65f6d006-393f-423b-9d2a-977d33371ab8',
  instances: {
    prefix: 'in',
    startNumber: 1,
  },
  holdings: {
    prefix: 'ho',
    startNumber: 1,
  },
  items: {
    prefix: 'it',
    startNumber: 1,
  },
  commonRetainLeadingZeroes: true,
  metadata: {
    createdByUserId: faker.random.uuid(),
    createdDate: formatDateString(faker.date.future(0.1).toString()),
    updatedByUserId: faker.random.uuid(),
    updatedDate: formatDateString(faker.date.future(0.1).toString()),
  },
};

export default hridSettings;
