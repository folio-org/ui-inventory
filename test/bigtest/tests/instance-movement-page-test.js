import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';

import InstanceMovementDetails from '../interactors/instance-movement-page';

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
      { title: titleInstanceFrom },
    );
    const instanceTo = this.server.create(
      'instance',
      'withStatisticalCodeIds',
      'withSubjects',
      'withNotes',
      { title: titleInstanceTo },
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
});
