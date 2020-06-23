import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';

import InstanceMovementDetails from '../interactors/instance-movement-page';
import InstanceViewPage from '../interactors/instance-view-page';

const titleInstanceFrom = 'FROM ADVANCING RESEARCH';
const titleInstanceTo = 'TO ADVANCING RESEARCH';

describe('InstanceMovementPage', () => {
  setupApplication();

  const instanceMovementDetailsFrom = new InstanceMovementDetails({
    scope: '[data-test-movement-from-instance-details]'
  });
  const instanceMovementDetailsTo = new InstanceMovementDetails({
    scope: '[data-test-movement-to-instance-details]'
  });

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
});
