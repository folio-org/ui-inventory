import faker from 'faker';
import ApplicationFactory from './application';

const {
  lorem,
  random,
} = faker;

export default ApplicationFactory.extend({
  id: () => random.uuid(),
  name: () => lorem.word(),
  source: () => lorem.word(),
});
