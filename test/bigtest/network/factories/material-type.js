import faker from 'faker';
import ApplicationFactory from './application';

export default ApplicationFactory.extend({
  name: () => faker.company.catchPhrase(),
  source: () => faker.company.catchPhrase(),
});
