import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import {
  NUMBER_GENERATOR_OPTIONS_OFF,
  NUMBER_GENERATOR_OPTIONS_ON_EDITABLE,
  NUMBER_GENERATOR_OPTIONS_ON_NOT_EDITABLE,
  NUMBER_GENERATOR_SETTINGS_KEY,
  NUMBER_GENERATOR_SETTINGS_SCOPE,
} from '../../../settings/NumberGeneratorSettings/constants';
import { useNumberGeneratorOptions } from './useNumberGeneratorOptions';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const NUMBER_GENERATOR = {
  barcode: NUMBER_GENERATOR_OPTIONS_OFF,
  accessionNumber: NUMBER_GENERATOR_OPTIONS_ON_EDITABLE,
  callNumber: NUMBER_GENERATOR_OPTIONS_ON_EDITABLE,
  callNumberHoldings: '',
  identifier: NUMBER_GENERATOR_OPTIONS_ON_NOT_EDITABLE,
  useSharedNumber: false,
};

const mockData = {
  id: '8cc688c4-e7da-438e-98a7-d101cad104f4',
  key: NUMBER_GENERATOR_SETTINGS_KEY,
  scope: NUMBER_GENERATOR_SETTINGS_SCOPE,
  value: NUMBER_GENERATOR,
};

describe('useNumberGeneratorOptions', () => {
  beforeEach(() => {
    queryClient.clear();

    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => Promise.resolve({ items: [mockData] }),
        }),
      });
  });

  it('should fetch and normalize number generator options', async () => {
    const { result } = renderHook(() => useNumberGeneratorOptions(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current).toEqual(expect.objectContaining({
      isLoading: false,
      data: NUMBER_GENERATOR,
    }));
  });

  describe('when no settings have been saved yet', () => {
    it('should resolve with default empty values', async () => {
      useOkapiKy.mockReturnValue({
        get: () => ({
          json: () => Promise.resolve({ items: [] }),
        }),
      });

      const { result } = renderHook(() => useNumberGeneratorOptions(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBeFalsy());

      expect(result.current).toEqual(expect.objectContaining({
        isLoading: false,
        data: {
          accessionNumber: '',
          barcode: '',
          callNumber: '',
          callNumberHoldings: '',
          identifier: '',
          useSharedNumber: false,
        },
      }));
    });
  });
});
