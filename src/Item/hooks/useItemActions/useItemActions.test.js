import { useHistory, useLocation, useParams } from 'react-router-dom';

import { useStripes } from '@folio/stripes/core';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../test/jest/__mock__';

import useItemModalsContext from '../useItemModalsContext';
import useItemActions from './useItemActions';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(),
  useLocation: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('../useItemModalsContext', () => jest.fn());

const mockHistory = {
  push: jest.fn(),
};
const mockLocation = {
  search: '?query=test',
};
const mockParams = {
  id: 'instance-id',
  holdingsrecordid: 'holdings-id',
  itemid: 'item-id',
};
const mockStripes = {
  okapi: {
    tenant: 'test-tenant',
  },
};
const mockModalsContext = {
  setIsCannotDeleteItemModalOpen: jest.fn(),
  setCannotDeleteItemModalMessageId: jest.fn(),
  setIsConfirmDeleteItemModalOpen: jest.fn(),
  setIsItemMissingModalOpen: jest.fn(),
  setIsItemWithdrawnModalOpen: jest.fn(),
  setSelectedItemStatus: jest.fn(),
  setIsSelectedItemStatusModalOpen: jest.fn(),
};

describe('useItemActions', () => {
  beforeEach(() => {
    useHistory.mockReturnValue(mockHistory);
    useLocation.mockReturnValue(mockLocation);
    useParams.mockReturnValue(mockParams);
    useStripes.mockReturnValue(mockStripes);
    useItemModalsContext.mockReturnValue(mockModalsContext);
  });

  it('should handle edit action', () => {
    const { result } = renderHook(() => useItemActions({ initialTenantId: 'initial-tenant' }));
    const event = { preventDefault: jest.fn() };

    result.current.handleEdit(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(mockHistory.push).toHaveBeenCalledWith({
      pathname: '/inventory/edit/instance-id/holdings-id/item-id',
      search: '?query=test',
      state: {
        tenantFrom: 'test-tenant',
        initialTenantId: 'initial-tenant',
      },
    });
  });

  it('should handle copy action', () => {
    const { result } = renderHook(() => useItemActions({ initialTenantId: 'initial-tenant' }));

    result.current.handleCopy();

    expect(mockHistory.push).toHaveBeenCalledWith({
      pathname: '/inventory/copy/instance-id/holdings-id/item-id',
      search: '?query=test',
      state: {
        tenantFrom: 'test-tenant',
        initialTenantId: 'initial-tenant',
      },
    });
  });

  describe('handleDelete', () => {
    it('should open cannot delete modal for non-removable item status', () => {
      const { result } = renderHook(() => useItemActions({}));
      const item = { status: { name: 'Aged to lost' } };

      result.current.handleDelete(item);

      expect(mockModalsContext.setIsCannotDeleteItemModalOpen).toHaveBeenCalledWith(true);
      expect(mockModalsContext.setCannotDeleteItemModalMessageId)
        .toHaveBeenCalledWith('ui-inventory.noItemDeleteModal.statusMessage');
    });

    it('should open cannot delete modal for on-order item', () => {
      const { result } = renderHook(() => useItemActions({}));
      const item = { status: { name: 'On order' } };

      result.current.handleDelete(item);

      expect(mockModalsContext.setIsCannotDeleteItemModalOpen).toHaveBeenCalledWith(true);
      expect(mockModalsContext.setCannotDeleteItemModalMessageId)
        .toHaveBeenCalledWith('ui-inventory.noItemDeleteModal.orderMessage');
    });

    it('should open cannot delete modal for item with request', () => {
      const { result } = renderHook(() => useItemActions({}));
      const item = { status: { name: 'Available' } };

      result.current.handleDelete(item, true);

      expect(mockModalsContext.setIsCannotDeleteItemModalOpen).toHaveBeenCalledWith(true);
      expect(mockModalsContext.setCannotDeleteItemModalMessageId)
        .toHaveBeenCalledWith('ui-inventory.noItemDeleteModal.requestMessage');
    });

    it('should open confirm delete modal for deletable item', () => {
      const { result } = renderHook(() => useItemActions({}));
      const item = { status: { name: 'Available' } };

      result.current.handleDelete(item);

      expect(mockModalsContext.setIsConfirmDeleteItemModalOpen).toHaveBeenCalledWith(true);
    });
  });

  it('should handle mark as missing action', () => {
    const { result } = renderHook(() => useItemActions({}));

    result.current.handleMarcAsMissing();

    expect(mockModalsContext.setIsItemMissingModalOpen).toHaveBeenCalledWith(true);
  });

  it('should handle mark as withdrawn action', () => {
    const { result } = renderHook(() => useItemActions({}));

    result.current.handleMarkAsWithdrawn();

    expect(mockModalsContext.setIsItemWithdrawnModalOpen).toHaveBeenCalledWith(true);
  });

  it('should handle mark with status action', () => {
    const { result } = renderHook(() => useItemActions({}));
    const status = 'Available';

    result.current.handleMarkWithStatus(status);

    expect(mockModalsContext.setSelectedItemStatus).toHaveBeenCalledWith(status);
    expect(mockModalsContext.setIsSelectedItemStatusModalOpen).toHaveBeenCalledWith(true);
  });
});
