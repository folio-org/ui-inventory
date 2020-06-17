import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import ItemCreatePage from '../interactors/item-create-page';

describe('Create Item page', () => {
  setupApplication();

  let instance;

  const holdings = {
    id: '0e3a404a-61a9-4388-9d11-c7d62d491165',
    callNumber: 911,
  };

  beforeEach(async function () {
    instance = this.server.create('instance', {
      title: 'ADVANCING RESEARCH',
    });

    this.server.get('/holdings-storage/holdings/:id', holdings);

    this.visit(`/inventory/create/${instance.id}/${holdings.id}/item`);

    await ItemCreatePage.whenLoaded();
  });

  it('displays a title in the pane header', () => {
    expect(ItemCreatePage.title).to.equal(`${instance.title}`);
  });
});
