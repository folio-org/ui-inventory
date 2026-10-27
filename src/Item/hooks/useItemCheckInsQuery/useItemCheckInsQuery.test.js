import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  act,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import useItemCheckInsQuery from './useItemCheckInsQuery';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const mockCheckIns = [
  {
    id: 'check-in-1',
    occurredDateTime: '2026-10-14T09:54:00Z',
    inHouseUse: true,
    staffMember: { personal: { firstName: 'Margaret', lastName: 'Simpson' } },
    servicePoint: { id: 'sp-1', name: 'Reference Desk' },
  },
];

describe('useItemCheckInsQuery', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ checkIns: mockCheckIns, totalRecords: 1 }),
      }),
    });
  });

  it('should fetch check-ins for an item', async () => {
    const { result } = renderHook(() => useItemCheckInsQuery('item-id'), { wrapper });

    await act(() => !result.current.isLoading);

    expect(result.current.checkIns).toEqual(mockCheckIns);
    expect(result.current.totalRecords).toBe(1);
  });

  it('should not fetch when itemId is not provided', () => {
    const { result } = renderHook(() => useItemCheckInsQuery(null), { wrapper });

    expect(result.current.checkIns).toEqual([]);
    expect(result.current.totalRecords).toBe(0);
  });

  it('should expose pagination controls', () => {
    const { result } = renderHook(() => useItemCheckInsQuery('item-id'), { wrapper });

    expect(result.current.offset).toBe(0);
    expect(typeof result.current.setOffset).toBe('function');
    expect(result.current.limit).toBe(100);
  });
});
