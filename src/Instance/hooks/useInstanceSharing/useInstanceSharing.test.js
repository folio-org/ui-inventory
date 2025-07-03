import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../test/jest/__mock__';

import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import useInstanceSharing from './useInstanceSharing';
import { INSTANCE_SHARING_STATUSES } from '../../../constants';
import useShareLocalInstance from '../useShareLocalInstance';
import useInstanceModalsContext from '../useInstanceModalsContext';

jest.mock('../useShareLocalInstance', () => jest.fn());
jest.mock('../useInstanceModalsContext', () => jest.fn());

const mockSetIsShareLocalInstanceModalOpen = jest.fn();
const mockSetIsUnlinkAuthoritiesModalOpen = jest.fn();
const mockSetIsShareButtonDisabled = jest.fn();

const mockShareInstance = jest.fn();

const instance = { id: 'instance-id', title: 'Test Instance' };
const tenantId = 'tenant-id';
const centralTenantId = 'central-tenant-id';
const consortiumId = 'consortium-id';

const refetchInstance = jest.fn();
const sendCallout = jest.fn();

const getDefaultModalsContext = () => ({
  setIsShareLocalInstanceModalOpen: mockSetIsShareLocalInstanceModalOpen,
  setIsUnlinkAuthoritiesModalOpen: mockSetIsUnlinkAuthoritiesModalOpen,
  setIsShareButtonDisabled: mockSetIsShareButtonDisabled,
});

describe('useInstanceSharing', () => {
  beforeEach(() => {
    useShareLocalInstance.mockReturnValue({ shareInstance: mockShareInstance });
    useInstanceModalsContext.mockReturnValue(getDefaultModalsContext());
    useStripes.mockReturnValue({
      user: {
        user: {
          consortium: { id: consortiumId },
        },
      },
    });
    useOkapiKy.mockReturnValue({
      get: jest.fn().mockReturnValue({
        json: jest.fn().mockResolvedValue({ sharingInstances: [{ status: INSTANCE_SHARING_STATUSES.COMPLETE }] }),
      }),
    });
  });

  it('should start sharing and handle success flow', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useInstanceSharing({
      instance,
      tenantId,
      centralTenantId,
      refetchInstance,
      sendCallout,
    }));

    await act(async () => {
      await result.current.handleShareLocalInstance();
    });

    expect(mockShareInstance).toHaveBeenCalledWith({
      consortiumId,
      body: {
        sourceTenantId: tenantId,
        instanceIdentifier: instance.id,
        targetTenantId: centralTenantId,
      },
    });
    expect(mockSetIsUnlinkAuthoritiesModalOpen).toHaveBeenCalledWith(false);
    expect(mockSetIsShareLocalInstanceModalOpen).toHaveBeenCalledWith(false);
    expect(mockSetIsShareButtonDisabled).toHaveBeenCalledWith(false);
    expect(result.current.isInstanceSharing).toBe(true);

    // Simulate polling interval
    await act(async () => {
      jest.advanceTimersByTime(2000);
      // Wait for polling promise to resolve
      await Promise.resolve();
    });

    expect(refetchInstance).toHaveBeenCalled();
    expect(sendCallout).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
    expect(result.current.isInstanceSharing).toBe(false);
    jest.useRealTimers();
  });

  it('should handle error from shareInstance', async () => {
    mockShareInstance.mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useInstanceSharing({
      instance,
      tenantId,
      centralTenantId,
      refetchInstance,
      sendCallout,
    }));

    await act(async () => {
      await result.current.handleShareLocalInstance();
    });

    expect(sendCallout).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
    expect(result.current.isInstanceSharing).toBe(false);
    expect(mockSetIsShareButtonDisabled).toHaveBeenCalledWith(false);
  });

  it('should handle error status during polling', async () => {
    jest.useFakeTimers();
    useOkapiKy.mockReturnValue({
      get: jest.fn().mockReturnValue({
        json: jest.fn().mockResolvedValue({ sharingInstances: [{ status: INSTANCE_SHARING_STATUSES.ERROR }] }),
      }),
    });
    const { result } = renderHook(() => useInstanceSharing({
      instance,
      tenantId,
      centralTenantId,
      refetchInstance,
      sendCallout,
    }));

    await act(async () => {
      await result.current.handleShareLocalInstance();
    });

    await act(async () => {
      jest.advanceTimersByTime(2000);
      await Promise.resolve();
    });

    expect(sendCallout).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
    expect(result.current.isInstanceSharing).toBe(false);
    jest.useRealTimers();
  });

  it('should handle network error during polling', async () => {
    jest.useFakeTimers();
    useOkapiKy.mockReturnValue({
      get: jest.fn().mockReturnValue({
        json: jest.fn().mockRejectedValue(new Error('network error')),
      }),
    });
    const { result } = renderHook(() => useInstanceSharing({
      instance,
      tenantId,
      centralTenantId,
      refetchInstance,
      sendCallout,
    }));

    await act(async () => {
      await result.current.handleShareLocalInstance();
    });

    await act(async () => {
      jest.advanceTimersByTime(2000);
      await Promise.resolve();
    });

    expect(sendCallout).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
    expect(result.current.isInstanceSharing).toBe(false);
    jest.useRealTimers();
  });
});
