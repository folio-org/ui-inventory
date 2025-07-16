import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  waitFor,
  renderHook,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import '../../../../test/jest/__mock__';


import useAuthoritiesByIdQuery from './useAuthoritiesByIdQuery';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);


const mockAuthoritiesRecords = [{ id: 'authorityId1' }, { id: 'authorityId2' }];

describe('useAuthoritiesByIdQuery', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => {
        return ({
          json: () => Promise.resolve({ authorities: mockAuthoritiesRecords })
        });
      },
    });
  });

  it('should fetch authorities', async () => {
    const ids = ['authorityId1', 'authorityId2'];

    const { result } = renderHook(() => useAuthoritiesByIdQuery(ids), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual(mockAuthoritiesRecords));
  });
});
