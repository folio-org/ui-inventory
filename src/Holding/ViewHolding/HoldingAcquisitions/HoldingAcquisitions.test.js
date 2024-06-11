import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { useStripes } from '@folio/stripes/core';
import { screen } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../test/jest/__mock__';
import {
  renderWithIntl,
  translationsProperties,
} from '../../../../test/jest/helpers';

import {
  holdingSummaries,
  holdingOrderLine,
} from './fixtures';
import HoldingAcquisitions from './HoldingAcquisitions';
import useHoldingOrderLines from './useHoldingOrderLines';

import * as utils from '../../../utils';

jest.mock('./useHoldingOrderLines', () => jest.fn());

const spyOnIsUserInConsortiumMode = jest.spyOn(utils, 'isUserInConsortiumMode');

const renderHoldingAcquisitions = ({
  holding = {},
  withSummary = true,
} = {}) => (
  renderWithIntl(
    <Router>
      <HoldingAcquisitions holding={holding} withSummary={withSummary} />
    </Router>,
    translationsProperties
  )
);

describe('HoldingAcquisitions component', () => {
  beforeEach(() => {
    useHoldingOrderLines.mockClear().mockReturnValue({ holdingOrderLines: holdingSummaries });
  });

  it('should display acq holding fields', () => {
    renderHoldingAcquisitions({ holding: { id: 'holdingUid' }, withSummary: false });

    expect(screen.getByText('Acquisition method')).toBeInTheDocument();
    expect(screen.getByText('Order format')).toBeInTheDocument();
    expect(screen.getByText('Receipt status')).toBeInTheDocument();
  });

  it('should not display order lines table when summary is disabled', () => {
    renderHoldingAcquisitions({ holding: { id: 'holdingUid' }, withSummary: false });

    expect(screen.queryByText(holdingOrderLine.poLineNumber)).not.toBeInTheDocument();
  });

  describe('when user is non-consortial tenant', () => {
    it('should display acquisition accordion and fetched holding acquisition data', () => {
      spyOnIsUserInConsortiumMode.mockReturnValue(false);
      useStripes.mockClear().mockReturnValue({
        hasInterface: () => true,
        okapi: { tenant: 'diku' },
        user: { user: {} },
      });

      const { container } = renderHoldingAcquisitions({ holding: { id: 'holdingUid' } });

      expect(container.querySelector('#acc06')).toBeInTheDocument();
      expect(screen.getByText(holdingOrderLine.poLineNumber)).toBeInTheDocument();
    });
  });

  describe('when user is in central tenant', () => {
    it('should display acquisition accordion and fetched holding acquisition data', () => {
      spyOnIsUserInConsortiumMode.mockReturnValue(true);
      useStripes.mockClear().mockReturnValue({
        hasInterface: () => true,
        okapi: { tenant: 'consortium' },
        user: { user: {
          consortium: { centralTenantId: 'consortium' },
          tenants: [{
            id: 'consortium',
            name: 'Consortium',
          }],
        } },
      });

      const { container } = renderHoldingAcquisitions({ holding: { id: 'holdingUid' } });

      expect(container.querySelector('#acc06')).toBeInTheDocument();
      expect(screen.getByText(holdingOrderLine.poLineNumber)).toBeInTheDocument();
    });
  });

  describe('when user is in member tenant', () => {
    it('should display central and member tenant subaccordions with fetched instance acquisition data', () => {
      spyOnIsUserInConsortiumMode.mockReturnValue(true);
      useStripes.mockClear().mockReturnValue({
        hasInterface: () => true,
        okapi: { tenant: 'college' },
        user: { user: {
          consortium: { centralTenantId: 'consortium' },
          tenants: [{
            id: 'consortium',
            name: 'Consortium',
          }, {
            id: 'college',
            name: 'College',
          }],
        } },
      });

      const { container } = renderHoldingAcquisitions({ holding: { id: 'holdingUid' } });

      expect(container.querySelector('#acc06')).toBeInTheDocument();
      expect(container.querySelector('#active-tenant-order-lines-accordion')).toBeInTheDocument();
      expect(screen.getAllByText(holdingOrderLine.poLineNumber)[0]).toBeInTheDocument();

      expect(container.querySelector('#central-tenant-order-lines-accordion')).toBeInTheDocument();
      expect(screen.getAllByText(holdingOrderLine.poLineNumber)[1]).toBeInTheDocument();
    });
  });
});
