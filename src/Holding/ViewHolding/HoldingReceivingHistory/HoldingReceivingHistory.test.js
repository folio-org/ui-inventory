import React from 'react';

import { screen } from '@testing-library/react';

import '../../../../test/jest/__mock__';
import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';

import {
  receivingHistory,
} from './fixtures';
import HoldingReceivingHistory from './HoldingReceivingHistory';
import useReceivingHistory from './useReceivingHistory';

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
  });
});
