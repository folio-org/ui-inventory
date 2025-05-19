import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { screen, act } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../test/jest/helpers';

import { itemStatusesMap } from '../../../../constants';

import ItemStatus from './ItemStatus';

jest.mock('../../../../constants', () => ({
  ...jest.requireActual('../../../../constants'),
  itemStatusesMap: () => <div>ViewMetaData 1</div>,
}));

const mockMutator = {
  item: {
    GET: jest.fn().mockResolvedValueOnce([{ id: 123, name: 'Test' }]),
  },
  servicePoint: {
    GET: jest.fn().mockResolvedValueOnce([{ id: 223, name: 'Test2' }]),
  },
};

const defaultProps = {
  itemId: 'item-123',
  status: { name: 'Checked out', date: '2023-03-01T00:00:00.000Z' },
  openLoan: {},
  mutator: mockMutator,
};

const renderItemStatusSetup = (props) => renderWithIntl(
  <MemoryRouter>
    <ItemStatus
      {...defaultProps}
      {...props}
    />
  </MemoryRouter>,
  translationsProperties
);

describe('ItemStatus', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display loading', async () => {
    const status = { name: itemStatusesMap.IN_TRANSIT };
    const newMutator = {
      ...mockMutator,
      servicePoint: {
        GET: jest.fn().mockResolvedValue(),
      },
    };

    await act(async () => {
      renderItemStatusSetup({
        status,
        mutator: newMutator,
      });
    });

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('render ItemStatus', () => {
    renderItemStatusSetup();
    expect(screen.getByText(/Item status/i)).toBeInTheDocument();
    expect(screen.getByText(/Checked out/i)).toBeInTheDocument();
    expect(screen.getByText('status updated 3/1/2023, 12:00 AM')).toBeInTheDocument();
  });
});
