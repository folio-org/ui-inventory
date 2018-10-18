import { beforeEach, describe, it } from '@bigtest/mocha';

import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';

async function get(path) {
  return (await fetch(`http://localhost:9130/${path}`)).json();
}
describe('Mirage: instances', () => {
  setupApplication();

  let index;
  let individual;
  let instance;
  beforeEach(async function () {
    instance = this.server.create('instance', {
      title: 'ADVANCING RESEARCH METHODS WITH NEW TECHNOLOGIES.',
      source: 'Local',
      contributors: [{ name: 'Jules, Julian' }],
      identifiers: [{ value: '1234-5678' }]
    });
    index = await get('inventory/instances');
    individual = await get(`inventory/instances/${instance.id}`);
  });

  it('stubs the index and entity GET endpoints', function () {
    expect(index.instances.length).to.equal(1);
    expect(index.totalRecords).to.equal(1);
    const [first] = index.instances;
    expect(first).to.include({ title: 'ADVANCING RESEARCH METHODS WITH NEW TECHNOLOGIES.' });
    expect(individual).to.include({
      'title': 'ADVANCING RESEARCH METHODS WITH NEW TECHNOLOGIES.',
      '@context': 'http://localhost:9130/inventory/instance/context',
    });
    expect(individual.links).to.include({
      self: `http://localhost:9130/inventory/instances/${instance.id}`
    });
  });
});
