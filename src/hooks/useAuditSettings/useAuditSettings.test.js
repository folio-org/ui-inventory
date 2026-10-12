import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  act,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import '../../../test/jest/__mock__';

import { useAuditSettings } from './useAuditSettings';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const settings = [{
  id: 'records.page.size',
  value: 10,
  description: 'test',
}];

const mockGet = jest.fn().mockReturnValue({
  json: () => Promise.resolve({
    settings,
  }),
});

const mockPut = jest.fn().mockResolvedValue({});

describe('useAuditSettings', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
      put: mockPut,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch mod-audit config settings', async () => {
    const group = 'audit.inventory';

    const { result } = renderHook(() => useAuditSettings({ group }), { wrapper });

    await act(() => !result.current.isSettingsLoading);

    expect(mockGet).toHaveBeenCalledWith(`audit/config/groups/${group}/settings`);
    expect(result.current.settings).toEqual(settings);
  });

  describe('when calling updateSetting', () => {
    it('should make a put request with correct data', async () => {
      const group = 'audit.inventory';
      const settingKey = 'records.page.size';

      const { result } = renderHook(() => useAuditSettings({ group }), { wrapper });

      await act(() => !result.current.isSettingsLoading);
      jest.clearAllMocks();

      await act(() => result.current.updateSetting({
        body: 'some body',
        settingKey,
      }));

      expect(mockPut).toHaveBeenCalledWith(`audit/config/groups/${group}/settings/${settingKey}`, { json: 'some body' });

      await waitFor(() => expect(mockGet).toHaveBeenCalledWith(`audit/config/groups/${group}/settings`));
    });
  });
});
