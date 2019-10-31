import { beforeEach, describe, it } from '@bigtest/mocha';

import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import HoldingsRouteInteractor from '../../../interactors/routes/holdings-route';

describe('HoldingsRoute', () => {
  setupApplication();

  const holdingsRoute = new HoldingsRouteInteractor();

  beforeEach(async function () {
    this.visit('/inventory/holdings');
  });

  it('opens holdings route', () => {
    expect(holdingsRoute.isPresent).to.equal(true);
  });
});
