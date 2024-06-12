import React from 'react';

import {
  useStripes,
  checkIfUserInMemberTenant,
} from '@folio/stripes/core';
import { screen } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../test/jest/__mock__';
import {
  renderWithIntl,
  translationsProperties,
} from '../../../../test/jest/helpers';

import { receivingHistory } from './fixtures';
import HoldingReceivingHistory from './HoldingReceivingHistory';
import useReceivingHistory from './useReceivingHistory';

jest.mock('./useReceivingHistory', () => jest.fn());

const renderHoldingReceivingHistory = () => (
  renderWithIntl(
    <HoldingReceivingHistory holding={{ id: 'holdingId' }} />,
    translationsProperties,
  )
);

describe('HoldingReceivingHistory', () => {
  beforeEach(() => {
    useReceivingHistory.mockClear().mockReturnValue({ receivingHistory });
  });

  describe('when user is non-consortial tenant', () => {
    it('should render the accordion and fetched receiving history data', () => {
      checkIfUserInMemberTenant.mockClear().mockReturnValue(false);
      useStripes.mockClear().mockReturnValue({
        hasInterface: () => true,
        okapi: { tenant: 'diku' },
        user: { user: {} },
      });

      const { container } = renderHoldingReceivingHistory();

      expect(container.querySelector('#receiving-history-accordion')).toBeInTheDocument();
      expect(screen.getByText(receivingHistory[0].displaySummary)).toBeInTheDocument();
      expect(screen.getByText(receivingHistory[0].enumeration)).toBeInTheDocument();
      expect(screen.getByText(receivingHistory[0].chronology)).toBeInTheDocument();
    });
  });

  describe('when user is in central tenant', () => {
    it('should display the accordion and fetched receiving history data', () => {
      checkIfUserInMemberTenant.mockClear().mockReturnValue(false);
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

      const { container } = renderHoldingReceivingHistory();

      expect(container.querySelector('#receiving-history-accordion')).toBeInTheDocument();
      expect(screen.getByText(receivingHistory[0].displaySummary)).toBeInTheDocument();
      expect(screen.getByText(receivingHistory[0].enumeration)).toBeInTheDocument();
      expect(screen.getByText(receivingHistory[0].chronology)).toBeInTheDocument();
    });
  });

  describe('when user is in member tenant', () => {
    it('should display central and member tenant subaccordions with fetched receiving history data', () => {
      checkIfUserInMemberTenant.mockClear().mockReturnValue(true);
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

      const { container } = renderHoldingReceivingHistory();

      expect(container.querySelector('#receiving-history-accordion')).toBeInTheDocument();
      expect(container.querySelector('#active-receivings-accordion')).toBeInTheDocument();
      expect(screen.getAllByText(receivingHistory[0].displaySummary)[0]).toBeInTheDocument();

      expect(container.querySelector('#central-receivings-accordion')).toBeInTheDocument();
      expect(screen.getAllByText(receivingHistory[0].displaySummary)[1]).toBeInTheDocument();
    });
  });
});
