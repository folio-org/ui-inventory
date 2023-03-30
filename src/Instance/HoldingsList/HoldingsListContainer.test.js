import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '../../../test/jest/__mock__';
import { MemoryRouter } from 'react-router-dom';
import { useInstanceHoldingsQuery } from '../../providers';
import HoldingsListContainer from './HoldingsListContainer';

jest.mock('../../providers', () => ({
  useInstanceHoldingsQuery: jest.fn()
}));
jest.mock('./HoldingsList', () => jest.fn().mockReturnValue('Holdings List'));
jest.mock('../InstanceMovement/HoldingMovementList/HoldingsListMovement', () => jest.fn().mockReturnValue('HoldingMovementList'));
jest.mock('./Holding/HoldingContainer', () => jest.fn().mockReturnValue('HoldingContainer'));

describe('HoldingsListContainer', () => {
  const instance = {
    id: '123',
    title: 'Example Title'
  };

  const holdingsRecords = [
    {
      id: '456',
      callNumber: 'AB123',
      location: 'Main Library'
    },
    {
      id: '789',
      callNumber: 'CD456',
      location: 'Science Library'
    }
  ];

  it('should render a loading indicator when holdings data is loading', () => {
    useInstanceHoldingsQuery.mockReturnValue({
      holdingsRecords: [],
      isLoading: true
    });

    render(
      <MemoryRouter>
        <HoldingsListContainer instance={instance} />
      </MemoryRouter>
    );
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('should render the holdings list when holdings data is loaded', async () => {
    useInstanceHoldingsQuery.mockReturnValue({
      holdingsRecords,
      isLoading: false
    });

    render(
      <MemoryRouter>
        <HoldingsListContainer instance={instance} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Holdings List')).toBeInTheDocument();
    });
  });

  it('should render the holdings movement list when isHoldingsMove prop is true', async () => {
    useInstanceHoldingsQuery.mockReturnValue({
      holdingsRecords,
      isLoading: false
    });
    const isHoldingsMove = true;
    render(
      <MemoryRouter>
        <HoldingsListContainer instance={instance} isHoldingsMove={isHoldingsMove} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('HoldingMovementList')).toBeInTheDocument();
    });
  });
});
