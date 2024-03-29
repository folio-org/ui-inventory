import React from 'react';

import { screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../test/jest/__mock__';
import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';

import {
  receivingHistory,
} from './fixtures';
import HoldingReceivingHistory from './HoldingReceivingHistory';
import useReceivingHistory from './useReceivingHistory';
import { SORT_DIRECTION } from '../../../constants';

jest.mock('./useReceivingHistory', () => jest.fn());

const renderHoldingReceivingHistory = ({
  holding = {},
} = {}) => (renderWithIntl(<HoldingReceivingHistory holding={holding} />));

describe('HoldingReceivingHistory', () => {
  beforeEach(() => {
    useReceivingHistory.mockClear().mockReturnValue({ receivingHistory });
  });

  it('should display receiving history in table', () => {
    renderHoldingReceivingHistory({ id: 'holdingUid' });

    expect(screen.getByText(receivingHistory[0].enumeration)).toBeInTheDocument();
    expect(screen.getByText(receivingHistory[0].chronology)).toBeInTheDocument();
  });

  it('should apply sort by a column', () => {
    renderHoldingReceivingHistory({ id: 'holdingUid' });

    const displaySummaryHeader = screen.getAllByRole('columnheader')[0];
    const btn = screen.getByRole('button', { name: 'ui-inventory.displaySummary' });

    fireEvent.click(btn);
    expect(displaySummaryHeader.getAttribute('aria-sort')).toBe(SORT_DIRECTION.ASCENDING);

    fireEvent.click(btn);
    expect(displaySummaryHeader.getAttribute('aria-sort')).toBe(SORT_DIRECTION.DESCENDING);
  });
});
