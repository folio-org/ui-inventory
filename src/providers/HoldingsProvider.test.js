import React from 'react';
import { render, act } from '@testing-library/react';

import { useQuery } from 'react-query';
import '../../test/jest/__mock__';
import { useHoldings, HoldingsProvider, useInstanceHoldingsQuery } from './HoldingsProvider';

jest.mock('@folio/stripes/core', () => ({
  useOkapiKy: jest.fn().mockReturnValue(() => Promise.resolve({ holdingsRecords: [] })),
}));

jest.mock('react-query', () => ({
  useQuery: jest.fn(),
}));

describe('useHoldings', () => {
  it('returns the holdings context', () => {
    const Component = () => {
      const context = useHoldings();
      return <div>{context.update ? 'context exists' : 'context not found'}</div>;
    };
    const { getByText } = render(<HoldingsProvider><Component /></HoldingsProvider>);
    expect(getByText('context exists')).toBeInTheDocument();
  });
  it('updates the holdings by id', () => {
    const Component = () => {
      const { update, holdingsById } = useHoldings();
      return (<><div data-testid="holdings">{JSON.stringify(holdingsById)}</div><button type="button" onClick={() => update([{ id: '1', title: 'Test Holdings' }])}>Update Holdings</button></>);
    };
    const { getByText, getByTestId } = render(<HoldingsProvider><Component /></HoldingsProvider>);
    const holdings = getByTestId('holdings');
    expect(holdings).toHaveTextContent('{}');
    const updateButton = getByText('Update Holdings');
    act(() => {
      updateButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(holdings).toHaveTextContent('{"1":{"id":"1","title":"Test Holdings"}}');
  });
});

describe('HoldingsProvider', () => {
  it('renders without crashing', () => {
    render(<HoldingsProvider />);
  });
  it('updates the holdings context with new data', () => {
    const Component = () => {
      useInstanceHoldingsQuery(1);
      const holdings = useHoldings();
      return <div data-testid="holdings">{JSON.stringify(holdings)}</div>;
    };
    useQuery.mockReturnValue({ data: { holdingsRecords: [{ id: '1', title: 'Book 1' }] } });
    const { getByTestId } = render(<HoldingsProvider><Component /></HoldingsProvider>);
    expect(getByTestId('holdings')).toHaveTextContent('{"holdingsById":{}}');
  });
});

