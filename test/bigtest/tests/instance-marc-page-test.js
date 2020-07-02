import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';

import InstanceMarcPage from '../interactors/instance-marc-page';

const marcRecord = {
  parsedRecord: {
    content: {
      leader: '02926cas a2200733 a 4500',
      fields: [
        {
          '001': 'in00000000016',
        },
        {
          '019': { subfields: [{ a: '481144441' }, { a: '839814888' }], ind1: '3', ind2: ' ' },
        },
      ],
    },
  },
};

describe('InstanceMarcPage', () => {
  setupApplication();

  const instanceMarcPage = new InstanceMarcPage();

  beforeEach(async function () {
    const instance = this.server.create('instance');

    this.server.get('/source-storage/records/:id/formatted', marcRecord);

    this.visit(`/inventory/viewsource/${instance.id}`);

    await instanceMarcPage.whenLoaded();
  });

  it('should render instance marc view', () => {
    expect(instanceMarcPage.isPresent).to.be.true;
  });

  it('should display marc record fields', () => {
    expect(instanceMarcPage.fields().length).to.be.equal(
      marcRecord.parsedRecord.content.fields.length + 1
    );
  });

  describe('close action', () => {
    beforeEach(async function () {
      await instanceMarcPage.close();
    });

    it('should navigate from View Source page', () => {
      expect(instanceMarcPage.isPresent).to.be.false;
    });
  });
});
