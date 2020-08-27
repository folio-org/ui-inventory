import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';

import InstanceMovementDetails from '../interactors/instance-movement-page';
import InstanceMarcPage from '../interactors/instance-marc-page';
import InstanceViewPage from '../interactors/instance-view-page';
import InstanceEditPage from '../interactors/instance-edit-page';

const titleInstanceFrom = 'FROM ADVANCING RESEARCH';
const titleInstanceTo = 'TO ADVANCING RESEARCH';
const marcRecord = {
  parsedRecord: {
    content: { fields: [] },
  },
};

describe('InstanceMovementPage', () => {
  setupApplication();

  const instanceMarcPage = new InstanceMarcPage();
  const instanceMovementDetails = new InstanceMovementDetails();
  let instanceMovementDetailsFrom;
  let instanceMovementDetailsTo;

  beforeEach(async function () {
    const instanceFrom = this.server.create(
      'instance',
      'withHoldingAndItem',
      'withStatisticalCodeIds',
      'withAlternativeTitles',
      'withSeriesStatement',
      'withSubjects',
      'withNotes',
      {
        title: titleInstanceFrom,
        publication: [{
          publisher: 'International Pub',
        }],
        source: 'MARC',
      },
    );
    const instanceTo = this.server.create(
      'instance',
      'withStatisticalCodeIds',
      'withSubjects',
      'withNotes',
      {
        title: titleInstanceTo,
        publication: [{
          dateOfPublication: '2015',
          publisher: 'Musica International',
        }],
      },
    );

    this.server.get('/source-storage/records/:id/formatted', marcRecord);

    instanceMovementDetailsFrom = new InstanceMovementDetails({
      scope: `[data-test-instance-movement-details="${instanceFrom.id}"]`
    });
    instanceMovementDetailsTo = new InstanceMovementDetails({
      scope: `[data-test-instance-movement-details="${instanceTo.id}"]`
    });

    this.visit(`/inventory/move/${instanceFrom.id}/${instanceTo.id}/instance`);

    await instanceMovementDetailsFrom.whenLoaded();
    await instanceMovementDetailsTo.whenLoaded();
  });

  it('should render instance details from', () => {
    expect(instanceMovementDetailsFrom.isPresent).to.be.true;
    expect(instanceMovementDetailsFrom.title.includes(titleInstanceFrom)).to.be.true;
  });

  it('should render instance details to', () => {
    expect(instanceMovementDetailsTo.isPresent).to.be.true;
    expect(instanceMovementDetailsTo.title.includes(titleInstanceTo)).to.be.true;
  });

  describe('close FROM instance details action', () => {
    beforeEach(async () => {
      await instanceMovementDetailsFrom.close();

      await InstanceViewPage.whenLoaded();
    });

    it('should close movement instances screen', () => {
      expect(instanceMovementDetailsFrom.isPresent).to.be.false;
      expect(instanceMovementDetailsTo.isPresent).to.be.false;
    });

    it('should open instance TO details view in the instances list view', () => {
      expect(InstanceViewPage.title.includes(titleInstanceTo)).to.be.true;
    });
  });

  describe('close TO instance details action', () => {
    beforeEach(async () => {
      await instanceMovementDetailsTo.close();

      await InstanceViewPage.whenLoaded();
    });

    it('should close movement instances screen', () => {
      expect(instanceMovementDetailsFrom.isPresent).to.be.false;
      expect(instanceMovementDetailsTo.isPresent).to.be.false;
    });

    it('should open instance TO details view in the instances list view', () => {
      expect(InstanceViewPage.title.includes(titleInstanceFrom)).to.be.true;
    });
  });

  describe('View MARC action', () => {
    beforeEach(async () => {
      await instanceMovementDetailsFrom.headerDropdown.click();
      await instanceMovementDetailsFrom.headerDropdownMenu.clickViewMarc();

      await instanceMarcPage.whenLoaded();
    });

    it('should open View Source page', () => {
      expect(instanceMarcPage.isPresent).to.be.true;
    });

    describe('cancel View Source page', () => {
      beforeEach(async () => {
        await instanceMarcPage.close();

        await instanceMovementDetailsFrom.whenLoaded();
      });

      it('should navigate back to movement screen', () => {
        expect(instanceMovementDetailsFrom.isPresent).to.be.true;
        expect(instanceMovementDetailsTo.isPresent).to.be.true;
      });
    });
  });

  describe('Edit action', () => {
    beforeEach(async () => {
      await instanceMovementDetailsFrom.headerDropdown.click();
      await instanceMovementDetailsFrom.headerDropdownMenu.clickEdit();

      await InstanceEditPage.whenLoaded();
    });

    it('should open Edit instance page', () => {
      expect(InstanceEditPage.isPresent).to.be.true;
    });

    describe('cancel Edit instance page', () => {
      beforeEach(async () => {
        await InstanceEditPage.footer.clickCancel();

        await instanceMovementDetailsFrom.whenLoaded();
      });

      it('should navigate back to movement screen', () => {
        expect(instanceMovementDetailsFrom.isPresent).to.be.true;
        expect(instanceMovementDetailsTo.isPresent).to.be.true;
      });
    });
  });

  describe('Move action', () => {
    beforeEach(async () => {
      await instanceMovementDetailsFrom.MoveToDropdownButton.click();
      await instanceMovementDetailsFrom.moveToDropdown.list(0).click();
    });

    it('should open dropdown menu', () => {
      expect(instanceMovementDetails.confirmModal.confirmButton.isPresent).to.be.true;
    });
  });
});
