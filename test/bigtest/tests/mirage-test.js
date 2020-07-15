/* eslint-disable no-use-before-define */
import { beforeEach, describe, it } from '@bigtest/mocha';
import { camelize, pluralize, underscore } from 'inflected';

import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';

async function get(path) {
  return (await fetch(`http://localhost:9130/${path}`)).json();
}
describe('Mirage', () => {
  setupApplication();
  check('instance-type', 'name', 'code', 'source');
  check('identifier-type', 'name');
  check('contributor-type', 'name', 'code', 'source');
  check('contributor-name-type', 'name');
  check('instance-format', 'name', 'code', 'source');
  check('classification-type', 'name');
  check('instance-relationship-type', 'name');
  check('instance-status', 'name', 'code', 'source');
  check('electronic-access-relationship', 'name');
});

function check(entityName, ...fields) {
  const plural = pluralize(entityName);
  const attributes = fields.reduce((attrs, key) => {
    return Object.assign(attrs, {
      [key]: `the-${key}`
    });
  }, {});
  let index;
  let entity;
  describe(`/${entityName} API`, () => {
    beforeEach(async function () {
      const entry = this.server.create(entityName, attributes);
      index = await get(plural);
      entity = await get(`${plural}/${entry.id}`);
    });

    it('stubs the index and entity GET endpoints', function () {
      const entitiesName = camelize(underscore(plural), false);
      expect(index[entitiesName].length).to.equal(1);
      const [first] = index[entitiesName];
      expect(first).to.include(attributes);
      expect(entity).to.include(attributes);
    });
  });
}
