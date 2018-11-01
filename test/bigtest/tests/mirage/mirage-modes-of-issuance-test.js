import { beforeEach, describe, it } from '@bigtest/mocha';

import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';

async function get(path) {
  return (await fetch(`http://localhost:9130/${path}`)).json();
}
describe('Mirage: modes of issuance', () => {
  setupApplication();

  let index;
  let individual;
  beforeEach(async function () {
    const moi = this.server.create('issuance-mode', {
      name: 'single unit',
    });
    index = await get('modes-of-issuance');
    individual = await get(`modes-of-issuance/${moi.id}`);
  });

  it('stubs the index and entity GET endpoints', function () {
    expect(index.issuanceModes.length).to.equal(1);
    const [first] = index.issuanceModes;
    expect(first).to.include({ name: 'single unit' });
    expect(individual).to.include({ name: 'single unit' });
  });
});
