import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import useImportRecord from './useImportRecord';

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

describe('useImportRecord', () => {
  it('should import record successfully', async () => {
    const mockKy = {
      post: jest.fn(),
    };
    useOkapiKy.mockReturnValueOnce(mockKy);

    const { result } = renderHook(() => useImportRecord(), { wrapper });

    await act(async () => {
      const args = {
        externalIdentifierType: 'type-1',
        externalIdentifier: 'ext-123',
        selectedJobProfileId: 'job-456',
      };

      await result.current.importRecord({ instanceId: 'instance-123', args });
    });

    expect(mockKy.post).toHaveBeenCalledWith(
      '/inventory/import/instance-123',
      {
        json: {
          xidtype: 'type-1',
          xid: 'ext-123',
          jobprofileid: 'job-456',
        },
      }
    );
    expect(result.current.isImporting).toBe(false);
    expect(result.current.importingError).toBeNull();
  });
});
