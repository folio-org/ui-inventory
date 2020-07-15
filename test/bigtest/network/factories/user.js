import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  username: () => faker.internet.userName(),
  id: 'a6d49b51-62be-5599-bb82-b177c82ac716',
  personal: {
    firstName: 'John',
    lastName: 'Doe',
    middleName: 'Antony',
  }
});
