import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy, useStripes } from '@folio/stripes/core';

import useItemUpdateOwnership from './useItemUpdateOwnership';

import useHoldingMutation from '../../../hooks/useHoldingMutation';
import useUpdateOwnershipMutation from '../../../hooks/useUpdateOwnershipMutation';
import useItemModalsContext from '../useItemModalsContext';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
  useStripes: jest.fn(),
}));

jest.mock('../../../hooks/useHoldingMutation');
jest.mock('../../../hooks/useUpdateOwnershipMutation');
jest.mock('../useItemModalsContext');

const mockItem = {
  id: 'item-1',
  hrid: 'item-hrid-1',
  purchaseOrderLineIdentifier: 'pol-1',
};
const mockInstanceId = 'instance-1';
const mockTargetTenant = {
  id: 'tenant-1',
  name: 'Test Tenant',
};
const mockSetTargetTenant = jest.fn();
const mockHoldingsSourcesByName = {
  FOLIO: { id: 'folio-source' },
};
const mockCalloutContext = {
  sendCallout: jest.fn(),
};
const mockUpdateOwnershipData = {
  targetLocation: { id: 'location-1' },
  tenantId: 'tenant-1',
  holdingId: 'holding-1',
};
const mockSetUpdateOwnershipData = jest.fn();
const mockOnSuccess = jest.fn();

const mockKy = {
  get: jest.fn(),
};

const mockMutateHolding = jest.fn();
const mockUpdateOwnership = jest.fn();

const mockSetIsUpdateOwnershipModalOpen = jest.fn();
const mockSetIsLinkedLocalOrderLineModalOpen = jest.fn();
const mockSetIsConfirmUpdateOwnershipModalOpen = jest.fn();

const renderHookWithProps = (props) => {
  return renderHook(() => useItemUpdateOwnership({
    item: mockItem,
    instanceId: mockInstanceId,
    targetTenant: mockTargetTenant,
    setTargetTenant: mockSetTargetTenant,
    holdingsSourcesByName: mockHoldingsSourcesByName,
    calloutContext: mockCalloutContext,
    updateOwnershipData: mockUpdateOwnershipData,
    setUpdateOwnershipData: mockSetUpdateOwnershipData,
    onSuccess: mockOnSuccess,
    ...props,
  }));
};

describe('useItemUpdateOwnership', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useOkapiKy.mockReturnValue(mockKy);
    useStripes.mockReturnValue({
      user: {
        user: {
          tenants: [mockTargetTenant],
        },
      },
    });

    useHoldingMutation.mockReturnValue({ mutateHolding: mockMutateHolding });
    useUpdateOwnershipMutation.mockReturnValue({ updateOwnership: mockUpdateOwnership });
    useItemModalsContext.mockReturnValue({
      setIsUpdateOwnershipModalOpen: mockSetIsUpdateOwnershipModalOpen,
      setIsLinkedLocalOrderLineModalOpen: mockSetIsLinkedLocalOrderLineModalOpen,
      setIsConfirmUpdateOwnershipModalOpen: mockSetIsConfirmUpdateOwnershipModalOpen,
    });
  });

  describe('handleUpdateOwnership', () => {
    it('should open linked order line modal when purchase order line exists', async () => {
      const ky = { get: jest.fn().mockReturnValue({ json: () => Promise.resolve({}) }) };
      useOkapiKy.mockReturnValue(ky);

      const { result } = renderHookWithProps();
      await result.current.handleUpdateOwnership();

      expect(ky.get).toHaveBeenCalledWith('orders/order-lines/pol-1');
      expect(mockSetIsLinkedLocalOrderLineModalOpen).toHaveBeenCalledWith(true);
    });

    it('should open update ownership modal when no purchase order line exists', async () => {
      const itemWithoutPOL = { ...mockItem, purchaseOrderLineIdentifier: null };
      const { result } = renderHookWithProps({ item: itemWithoutPOL });

      await result.current.handleUpdateOwnership();

      expect(mockSetIsUpdateOwnershipModalOpen).toHaveBeenCalledWith(true);
    });
  });

  describe('onConfirmHandleUpdateOwnership', () => {
    it('should create new holding and update ownership when target location is provided', async () => {
      mockMutateHolding.mockResolvedValue({ id: 'new-holding-1' });
      mockUpdateOwnership.mockResolvedValue({});

      const { result } = renderHookWithProps();
      await result.current.onConfirmHandleUpdateOwnership();

      expect(mockMutateHolding).toHaveBeenCalledWith({
        permanentLocationId: 'location-1',
        instanceId: mockInstanceId,
        sourceId: 'folio-source',
      });

      expect(mockUpdateOwnership).toHaveBeenCalledWith({
        toHoldingsRecordId: 'new-holding-1',
        itemIds: [mockItem.id],
        targetTenantId: mockTargetTenant.id,
      });

      expect(mockCalloutContext.sendCallout).toHaveBeenCalled();
      expect(mockOnSuccess).toHaveBeenCalled();
    });

    it('should update ownership with existing holding when holdingId is provided', async () => {
      const dataWithHolding = {
        ...mockUpdateOwnershipData,
        targetLocation: null,
      };

      mockUpdateOwnership.mockResolvedValue({});

      const { result } = renderHookWithProps({ updateOwnershipData: dataWithHolding });

      await result.current.onConfirmHandleUpdateOwnership();

      expect(mockUpdateOwnership).toHaveBeenCalledWith({
        toHoldingsRecordId: 'holding-1',
        itemIds: [mockItem.id],
        targetTenantId: 'tenant-1',
      });

      expect(mockCalloutContext.sendCallout).toHaveBeenCalled();
      expect(mockOnSuccess).toHaveBeenCalled();
    });

    it('should show reference data error callout on 400 error', async () => {
      const dataWithHolding = {
        ...mockUpdateOwnershipData,
        targetLocation: null,
      };

      mockUpdateOwnership.mockRejectedValue({ response: { status: 400 } });

      const { result } = renderHookWithProps({ updateOwnershipData: dataWithHolding });

      await result.current.onConfirmHandleUpdateOwnership();

      expect(mockCalloutContext.sendCallout).toHaveBeenCalledWith({
        type: 'error',
        message: expect.any(Object),
      });
    });
  });

  describe('onCancelUpdateOwnership', () => {
    it('should reset state and close modal', () => {
      const { result } = renderHookWithProps();
      result.current.onCancelUpdateOwnership();

      expect(mockSetTargetTenant).toHaveBeenCalledWith({});
      expect(mockSetUpdateOwnershipData).toHaveBeenCalledWith({});
      expect(mockSetIsConfirmUpdateOwnershipModalOpen).toHaveBeenCalledWith(false);
    });
  });
});
